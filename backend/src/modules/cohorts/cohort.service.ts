import { AppError } from '../../errors/app-error.js';
import type { StatutCohorte } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateCohortInput, PatchCohortInput } from './cohort.schemas.js';

// Une cohorte est une promotion de startups qui suit le programme en même temps.
// Cycle de vie : candidatures ouvertes -> en cours -> terminée (sens unique).

const ORDER: Record<StatutCohorte, number> = {
  OUVERTE_CANDIDATURES: 0,
  EN_COURS: 1,
  TERMINEE: 2,
};

const cohortSelect = {
  id: true,
  nom: true,
  dateDebut: true,
  dateFin: true,
  statut: true,
  _count: { select: { startups: true, candidatures: true } },
} as const;

function toDto(cohort: {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
  statut: StatutCohorte;
  _count: { startups: number; candidatures: number };
}) {
  return {
    id: cohort.id,
    nom: cohort.nom,
    dateDebut: cohort.dateDebut,
    dateFin: cohort.dateFin,
    statut: cohort.statut,
    startupsCount: cohort._count.startups,
    candidaturesCount: cohort._count.candidatures,
  };
}

async function assertSingleOpenCohort(exceptId?: string) {
  const open = await prisma.cohorte.findFirst({
    where: { statut: 'OUVERTE_CANDIDATURES', ...(exceptId ? { id: { not: exceptId } } : {}) },
    select: { nom: true },
  });
  if (open) {
    throw AppError.conflict(
      `La cohorte « ${open.nom} » accepte déjà des candidatures. Passez-la « en cours » avant d'en ouvrir une autre.`,
    );
  }
}

export async function listCohorts() {
  const cohorts = await prisma.cohorte.findMany({
    select: cohortSelect,
    orderBy: [{ dateDebut: 'desc' }, { id: 'asc' }],
  });
  return cohorts.map(toDto);
}

export async function createCohort(input: CreateCohortInput, actorId: string) {
  if (input.statut === 'OUVERTE_CANDIDATURES') await assertSingleOpenCohort();

  const created = await prisma.$transaction(async (transaction) => {
    const cohort = await transaction.cohorte.create({
      data: { nom: input.nom, dateDebut: input.dateDebut, dateFin: input.dateFin, statut: input.statut },
      select: cohortSelect,
    });
    await transaction.auditLog.create({
      data: {
        userId: actorId,
        action: 'COHORTE_CREEE',
        entite: 'Cohorte',
        entiteId: cohort.id,
        meta: { statut: cohort.statut },
      },
    });
    return cohort;
  });
  return toDto(created);
}

export async function patchCohort(id: string, input: PatchCohortInput, actorId: string) {
  const current = await prisma.cohorte.findUnique({
    where: { id },
    select: { statut: true, dateDebut: true, dateFin: true },
  });
  if (!current) throw AppError.notFound('Cohorte introuvable.');

  if (input.statut && ORDER[input.statut] < ORDER[current.statut]) {
    throw AppError.conflict('Une cohorte ne peut pas revenir à un statut précédent.');
  }
  if (input.statut === 'OUVERTE_CANDIDATURES' && current.statut !== 'OUVERTE_CANDIDATURES') {
    await assertSingleOpenCohort(id);
  }

  const debut = input.dateDebut ?? current.dateDebut;
  const fin = input.dateFin ?? current.dateFin;
  if (fin <= debut) {
    throw AppError.badRequest('La date de fin doit être postérieure à la date de début.', {
      dateFin: ['La date de fin doit être postérieure à la date de début.'],
    });
  }

  const updated = await prisma.$transaction(async (transaction) => {
    const cohort = await transaction.cohorte.update({
      where: { id },
      data: {
        ...(input.nom !== undefined ? { nom: input.nom } : {}),
        ...(input.dateDebut !== undefined ? { dateDebut: input.dateDebut } : {}),
        ...(input.dateFin !== undefined ? { dateFin: input.dateFin } : {}),
        ...(input.statut !== undefined ? { statut: input.statut } : {}),
      },
      select: cohortSelect,
    });
    await transaction.auditLog.create({
      data: {
        userId: actorId,
        action: 'COHORTE_MODIFIEE',
        entite: 'Cohorte',
        entiteId: id,
        meta: { previousStatus: current.statut, newStatus: cohort.statut },
      },
    });
    return cohort;
  });
  return toDto(updated);
}

/** Tableau de suivi d'une cohorte : indicateurs, classement et startups actives. */
export async function getCohortOverview(id: string) {
  const cohort = await prisma.cohorte.findUnique({ where: { id }, select: cohortSelect });
  if (!cohort) throw AppError.notFound('Cohorte introuvable.');

  const startups = await prisma.startupProfile.findMany({
    where: { cohorteId: id },
    select: {
      id: true,
      nom: true,
      secteurs: true,
      stade: true,
      user: { select: { email: true } },
      membres: { select: { nom: true }, take: 1, orderBy: { id: 'asc' } },
      candidature: { select: { statut: true, score: true } },
      taches: { select: { statut: true } },
      meetings: {
        where: { statut: { in: ['CONFIRME', 'TERMINE'] } },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { nom: 'asc' },
  });

  const rows = startups.map((startup) => {
    const totalTasks = startup.taches.length;
    const doneTasks = startup.taches.filter((task) => task.statut === 'TERMINE').length;
    const secteurs = Array.isArray(startup.secteurs) ? (startup.secteurs as string[]) : [];
    return {
      id: startup.id,
      name: startup.nom,
      founder: startup.membres[0]?.nom ?? startup.user.email,
      sector: secteurs[0] ?? 'Général',
      stage: startup.stade,
      applicationStatus: startup.candidature?.statut ?? null,
      progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
      hasRoadmap: totalTasks > 0,
      doneTasks,
      totalTasks,
      lastMeeting: startup.meetings[0]?.createdAt ?? null,
    };
  });

  // Les startups « actives » sont celles dont la candidature est acceptée.
  const active = rows.filter((row) => row.applicationStatus === 'ACCEPTEE');
  const ranked = active.filter((row) => row.hasRoadmap).sort((a, b) => b.progress - a.progress);
  const top3 = ranked.slice(0, 3);
  const bottom3 = ranked.length > 3 ? [...ranked].reverse().slice(0, 3) : [];
  const averageProgress =
    ranked.length > 0 ? Math.round(ranked.reduce((sum, row) => sum + row.progress, 0) / ranked.length) : 0;

  return {
    cohort: toDto(cohort),
    activeCount: active.length,
    pendingCount: rows.length - active.length,
    averageProgress,
    top3: top3.map(({ id: startupId, name, progress }) => ({ id: startupId, name, progress })),
    bottom3: bottom3.map(({ id: startupId, name, progress }) => ({ id: startupId, name, progress })),
    startups: active,
  };
}
