import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { syncLeadFromApplication } from '../crm/crm.service.js';
import type {
  AdminApplicationListQuery,
  ApplicationDecisionInput,
  CreateApplicationInput,
  PatchOwnApplicationInput,
} from './application.schemas.js';

const cohortSummarySelect = {
  id: true,
  nom: true,
  dateDebut: true,
  dateFin: true,
  statut: true,
} satisfies Prisma.CohorteSelect;

const teamMemberSelect = {
  id: true,
  nom: true,
  role: true,
  linkedin: true,
} satisfies Prisma.TeamMemberSelect;

const ownApplicationSelect = {
  id: true,
  reponses: true,
  statut: true,
  score: true,
  motifDecision: true,
  rapportPdfUrl: true,
  dateDecision: true,
  createdAt: true,
  updatedAt: true,
  cohorte: { select: cohortSummarySelect },
  startup: {
    select: {
      id: true,
      nom: true,
      secteurs: true,
      stade: true,
      description: true,
      besoins: true,
      membres: {
        select: teamMemberSelect,
        orderBy: [{ nom: 'asc' }, { id: 'asc' }],
      },
    },
  },
} satisfies Prisma.CandidatureSelect;

const adminApplicationListSelect = {
  id: true,
  statut: true,
  score: true,
  dateDecision: true,
  createdAt: true,
  updatedAt: true,
  startup: {
    select: {
      id: true,
      nom: true,
      secteurs: true,
      stade: true,
    },
  },
  cohorte: { select: cohortSummarySelect },
} satisfies Prisma.CandidatureSelect;

const adminApplicationDetailSelect = {
  ...ownApplicationSelect,
  evaluateurId: true,
  startup: {
    select: {
      ...ownApplicationSelect.startup.select,
      user: {
        select: {
          id: true,
          email: true,
          actif: true,
        },
      },
    },
  },
} satisfies Prisma.CandidatureSelect;

export type OwnApplication = Prisma.CandidatureGetPayload<{
  select: typeof ownApplicationSelect;
}>;
export type AdminApplicationListItem = Prisma.CandidatureGetPayload<{
  select: typeof adminApplicationListSelect;
}>;
export type AdminApplicationDetail = Prisma.CandidatureGetPayload<{
  select: typeof adminApplicationDetailSelect;
}>;

const allowedApplicationTransitions: Readonly<Record<string, ReadonlySet<string>>> = {
  SOUMISE: new Set([
    'EN_EVALUATION',
    'ENTRETIEN_PLANIFIE',
    'ACCEPTEE',
    'LISTE_ATTENTE',
    'REFUSEE',
  ]),
  EN_EVALUATION: new Set(['ENTRETIEN_PLANIFIE', 'ACCEPTEE', 'LISTE_ATTENTE', 'REFUSEE']),
  ENTRETIEN_PLANIFIE: new Set(['ACCEPTEE', 'LISTE_ATTENTE', 'REFUSEE']),
};

async function resolveOpenCohort(transaction: Prisma.TransactionClient): Promise<{ id: string }> {
  const cohort = await transaction.cohorte.findFirst({
    where: { statut: 'OUVERTE_CANDIDATURES' },
    orderBy: [{ dateDebut: 'desc' }, { id: 'asc' }],
    select: { id: true },
  });

  if (!cohort) {
    throw AppError.conflict("Aucune cohorte n'accepte actuellement de candidatures.");
  }

  return cohort;
}

function startupPatchData(
  input: NonNullable<PatchOwnApplicationInput['startup']>,
): Prisma.StartupProfileUpdateInput {
  return {
    ...(input.nom !== undefined ? { nom: input.nom } : {}),
    ...(input.secteurs !== undefined ? { secteurs: input.secteurs } : {}),
    ...(input.stade !== undefined ? { stade: input.stade } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.besoins !== undefined ? { besoins: input.besoins } : {}),
  };
}

// Le CRM suit chaque candidature comme un lead, sans jamais bloquer le flux métier.
async function syncCrm(applicationId: string): Promise<void> {
  try {
    await syncLeadFromApplication(applicationId);
  } catch (error) {
    console.error('CRM: synchronisation du lead impossible', error);
  }
}

export async function createOwnApplication(
  userId: string,
  input: CreateApplicationInput,
): Promise<OwnApplication> {
  const created = await createOwnApplicationTransaction(userId, input);
  await syncCrm(created.id);
  return created;
}

async function createOwnApplicationTransaction(
  userId: string,
  input: CreateApplicationInput,
): Promise<OwnApplication> {
  return prisma.$transaction(async (transaction) => {
    const cohort = await resolveOpenCohort(transaction);
    const existingProfile = await transaction.startupProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        candidature: { select: { id: true } },
      },
    });

    if (existingProfile?.candidature) {
      throw AppError.conflict('Une candidature existe déjà pour cette startup.');
    }

    const startup = existingProfile
      ? await transaction.startupProfile.update({
          where: { id: existingProfile.id },
          data: {
            nom: input.startup.nom,
            secteurs: input.startup.secteurs,
            stade: input.startup.stade,
            description: input.startup.description,
            besoins: input.startup.besoins,
            cohorteId: cohort.id,
          },
          select: { id: true },
        })
      : await transaction.startupProfile.create({
          data: {
            userId,
            nom: input.startup.nom,
            secteurs: input.startup.secteurs,
            stade: input.startup.stade,
            description: input.startup.description,
            besoins: input.startup.besoins,
            cohorteId: cohort.id,
          },
          select: { id: true },
        });

    if (existingProfile) {
      await transaction.teamMember.deleteMany({ where: { startupId: startup.id } });
    }

    await transaction.teamMember.createMany({
      data: input.startup.membres.map((member) => ({
        startupId: startup.id,
        nom: member.nom,
        role: member.role,
        linkedin: member.linkedin ?? null,
      })),
    });

    const application = await transaction.candidature.create({
      data: {
        startupId: startup.id,
        cohorteId: cohort.id,
        reponses: input.reponses as Prisma.InputJsonValue,
      },
      select: ownApplicationSelect,
    });

    await transaction.auditLog.create({
      data: {
        userId,
        action: 'CANDIDATURE_SOUMISE',
        entite: 'Candidature',
        entiteId: application.id,
        meta: { statut: application.statut },
      },
    });

    return application;
  });
}

export async function getOwnApplication(userId: string): Promise<OwnApplication> {
  const application = await prisma.candidature.findFirst({
    where: { startup: { userId } },
    select: ownApplicationSelect,
  });

  if (!application) {
    throw AppError.notFound('Candidature introuvable.');
  }

  return application;
}

export async function patchOwnApplication(
  userId: string,
  input: PatchOwnApplicationInput,
): Promise<OwnApplication> {
  return prisma.$transaction(async (transaction) => {
    const current = await transaction.candidature.findFirst({
      where: { startup: { userId } },
      select: {
        id: true,
        startupId: true,
        statut: true,
        updatedAt: true,
      },
    });

    if (!current) {
      throw AppError.notFound('Candidature introuvable.');
    }

    if (current.statut !== 'SOUMISE') {
      throw AppError.conflict("La candidature n'est plus modifiable à ce stade.");
    }

    const claimed = await transaction.candidature.updateMany({
      where: { id: current.id, statut: 'SOUMISE', updatedAt: current.updatedAt },
      data: {
        ...(input.reponses !== undefined
          ? { reponses: input.reponses as Prisma.InputJsonValue }
          : {}),
        updatedAt: new Date(),
      },
    });

    if (claimed.count !== 1) {
      throw AppError.conflict('Cette candidature vient d’être traitée par une autre opération.');
    }

    if (input.startup) {
      await transaction.startupProfile.update({
        where: { id: current.startupId, userId },
        data: startupPatchData(input.startup),
      });

      if (input.startup.membres !== undefined) {
        await transaction.teamMember.deleteMany({ where: { startupId: current.startupId } });
        await transaction.teamMember.createMany({
          data: input.startup.membres.map((member) => ({
            startupId: current.startupId,
            nom: member.nom,
            role: member.role,
            linkedin: member.linkedin ?? null,
          })),
        });
      }
    }

    await transaction.auditLog.create({
      data: {
        userId,
        action: 'CANDIDATURE_MODIFIEE',
        entite: 'Candidature',
        entiteId: current.id,
      },
    });

    return transaction.candidature.findUniqueOrThrow({
      where: { id: current.id },
      select: ownApplicationSelect,
    });
  });
}

export async function listApplicationsForAdmin(input: AdminApplicationListQuery): Promise<{
  items: AdminApplicationListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}> {
  const where: Prisma.CandidatureWhereInput = {
    ...(input.statut ? { statut: input.statut } : {}),
    ...(input.cohorteId ? { cohorteId: input.cohorteId } : {}),
    ...(input.q
      ? {
          startup: {
            is: {
              OR: [
                { nom: { contains: input.q } },
                { description: { contains: input.q } },
              ],
            },
          },
        }
      : {}),
  };
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.candidature.findMany({
      where,
      select: adminApplicationListSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.candidature.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / input.pageSize),
    },
  };
}

export async function getApplicationForAdmin(
  applicationId: string,
): Promise<AdminApplicationDetail> {
  const application = await prisma.candidature.findUnique({
    where: { id: applicationId },
    select: adminApplicationDetailSelect,
  });

  if (!application) {
    throw AppError.notFound('Candidature introuvable.');
  }

  return application;
}

export async function decideApplication(
  applicationId: string,
  evaluatorId: string,
  input: ApplicationDecisionInput,
): Promise<AdminApplicationDetail> {
  const decided = await decideApplicationTransaction(applicationId, evaluatorId, input);
  await syncCrm(applicationId);
  return decided;
}

async function decideApplicationTransaction(
  applicationId: string,
  evaluatorId: string,
  input: ApplicationDecisionInput,
): Promise<AdminApplicationDetail> {
  return prisma.$transaction(async (transaction) => {
    const current = await transaction.candidature.findUnique({
      where: { id: applicationId },
      select: { id: true, statut: true, updatedAt: true },
    });

    if (!current) {
      throw AppError.notFound('Candidature introuvable.');
    }

    if (!allowedApplicationTransitions[current.statut]?.has(input.statut)) {
      throw AppError.conflict('Cette transition de candidature n est pas autorisee.');
    }

    const updated = await transaction.candidature.updateMany({
      where: { id: current.id, statut: current.statut, updatedAt: current.updatedAt },
      data: {
        statut: input.statut,
        ...(input.score !== undefined ? { score: input.score } : {}),
        motifDecision: input.motifDecision ?? null,
        evaluateurId: evaluatorId,
        dateDecision: new Date(),
      },
    });

    if (updated.count !== 1) {
      throw AppError.conflict('Cette candidature vient d’être modifiée par une autre opération.');
    }

    await transaction.auditLog.create({
      data: {
        userId: evaluatorId,
        action: 'CANDIDATURE_DECISION',
        entite: 'Candidature',
        entiteId: current.id,
        meta: {
          previousStatus: current.statut,
          newStatus: input.statut,
          ...(input.score !== undefined ? { score: input.score } : {}),
        },
      },
    });

    return transaction.candidature.findUniqueOrThrow({
      where: { id: current.id },
      select: adminApplicationDetailSelect,
    });
  });
}
