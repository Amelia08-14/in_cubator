import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import type {
  LeadActivityType,
  LeadSource,
  LeadStage,
  LeadStatus,
  LeadType,
} from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import {
  LEAD_STAGES,
  type CreateActivityInput,
  type CreateLeadInput,
  type LeadListQuery,
  type PatchLeadInput,
  type PublicLeadInput,
} from './crm.schemas.js';

// Cœur du CRM IN-CUBATOR : leads, pipeline en six étapes d'incubation, journal
// d'activité (notes, appels, rendez-vous planifiés) et indicateurs.

export const STAGE_LABEL: Record<LeadStage, string> = {
  NOUVEAU: 'Nouveau',
  DIAGNOSTIC: 'Diagnostic & structuration',
  ACCOMPAGNEMENT: 'Accompagnement & accélération',
  TEST_TERRAIN: 'Test & validation terrain',
  RESEAU: 'Réseau & visibilité',
  FORMATIONS: 'Formations & ateliers',
  LANCEMENT: 'Lancement & mise en marché',
};

// Probabilité de conversion associée à chaque étape (approche Odoo).
export const STAGE_PROBABILITY: Record<LeadStage, number> = {
  NOUVEAU: 10,
  DIAGNOSTIC: 20,
  ACCOMPAGNEMENT: 35,
  TEST_TERRAIN: 50,
  RESEAU: 65,
  FORMATIONS: 80,
  LANCEMENT: 90,
};

const staffSelect = { id: true, email: true } satisfies Prisma.UserSelect;

const leadInclude = {
  assignedTo: { select: staffSelect },
  _count: { select: { activities: true } },
} satisfies Prisma.LeadInclude;

type LeadRow = Prisma.LeadGetPayload<{ include: typeof leadInclude }>;

function probabilityOf(lead: { stage: LeadStage; status: LeadStatus }): number {
  if (lead.status === 'GAGNE') return 100;
  if (lead.status === 'PERDU') return 0;
  return STAGE_PROBABILITY[lead.stage];
}

function toDto(lead: LeadRow) {
  const { _count, ...rest } = lead;
  return { ...rest, probability: probabilityOf(lead), activityCount: _count.activities };
}

// --- Numérotation ---------------------------------------------------------------

async function nextReference(
  client: Prisma.TransactionClient | typeof prisma,
  offset: number,
): Promise<string> {
  const year = new Date().getFullYear();
  const count = await client.lead.count({
    where: { createdAt: { gte: new Date(`${year}-01-01T00:00:00.000Z`) } },
  });
  return `LD-${year}-${String(count + 1 + offset).padStart(4, '0')}`;
}

// La référence est unique en base : en cas de course entre deux créations
// simultanées, on retente avec le numéro suivant.
async function withReference<T>(
  create: (reference: string, client: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await prisma.$transaction(async (transaction) =>
        create(await nextReference(transaction, attempt), transaction),
      );
    } catch (error) {
      const duplicate =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
      if (!duplicate || attempt >= 4) throw error;
    }
  }
}

// --- Journal ---------------------------------------------------------------------

async function logSystem(
  client: Prisma.TransactionClient | typeof prisma,
  leadId: string,
  content: string,
  authorId: string | null,
) {
  await client.leadActivity.create({
    data: { leadId, authorId, type: 'SYSTEME', content, doneAt: new Date() },
  });
}

async function refreshNextActivity(client: Prisma.TransactionClient | typeof prisma, leadId: string) {
  const next = await client.leadActivity.findFirst({
    where: { leadId, doneAt: null, dueAt: { not: null } },
    orderBy: { dueAt: 'asc' },
    select: { dueAt: true },
  });
  await client.lead.update({ where: { id: leadId }, data: { nextActivityAt: next?.dueAt ?? null } });
}

async function assertStaff(userId: string | null | undefined) {
  if (!userId) return;
  const user = await prisma.user.findFirst({
    where: { id: userId, actif: true, role: { in: ['ADMIN', 'GESTIONNAIRE'] } },
    select: { id: true },
  });
  if (!user) throw AppError.badRequest('Le responsable choisi est introuvable ou inactif.');
}

async function getLeadOrThrow(id: string) {
  const lead = await prisma.lead.findUnique({ where: { id }, include: leadInclude });
  if (!lead) throw AppError.notFound('Lead introuvable.');
  return lead;
}

// --- Leads -----------------------------------------------------------------------

export async function listLeads(query: LeadListQuery) {
  const where: Prisma.LeadWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.stage ? { stage: query.stage } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(query.source ? { source: query.source } : {}),
    ...(query.unassigned
      ? { assignedToId: null }
      : query.assignedToId
        ? { assignedToId: query.assignedToId }
        : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q } },
            { contactName: { contains: query.q } },
            { email: { contains: query.q } },
            { companyName: { contains: query.q } },
            { reference: { contains: query.q } },
          ],
        }
      : {}),
  };

  const leads = await prisma.lead.findMany({
    where,
    include: leadInclude,
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: 1000,
  });
  return leads.map(toDto);
}

export async function getLead(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      ...leadInclude,
      activities: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: staffSelect } },
        take: 200,
      },
    },
  });
  if (!lead) throw AppError.notFound('Lead introuvable.');
  const { activities, ...rest } = lead;
  return { ...toDto(rest), activities };
}

export async function createLead(input: CreateLeadInput, actorId: string) {
  await assertStaff(input.assignedToId);
  const created = await withReference(async (reference, transaction) => {
    const lead = await transaction.lead.create({
      data: {
        reference,
        title: input.title,
        contactName: input.contactName,
        email: input.email ?? null,
        phone: input.phone ?? null,
        companyName: input.companyName ?? null,
        type: input.type,
        source: input.source,
        stage: input.stage,
        priority: input.priority,
        score: input.score ?? null,
        message: input.message ?? null,
        assignedToId: input.assignedToId ?? actorId,
      },
      select: { id: true },
    });
    await logSystem(transaction, lead.id, 'Lead créé.', actorId);
    return lead;
  });
  return toDto(await getLeadOrThrow(created.id));
}

export async function patchLead(id: string, input: PatchLeadInput, actorId: string) {
  const current = await getLeadOrThrow(id);
  if (input.assignedToId !== undefined) await assertStaff(input.assignedToId);

  if (input.stage && input.stage !== current.stage && current.status !== 'OUVERT') {
    throw AppError.conflict('Rouvrez le lead avant de le déplacer dans le pipeline.');
  }

  const data: Prisma.LeadUncheckedUpdateInput = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.contactName !== undefined ? { contactName: input.contactName } : {}),
    ...(input.email !== undefined ? { email: input.email } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.companyName !== undefined ? { companyName: input.companyName } : {}),
    ...(input.type !== undefined ? { type: input.type } : {}),
    ...(input.source !== undefined ? { source: input.source } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.score !== undefined ? { score: input.score } : {}),
    ...(input.message !== undefined ? { message: input.message } : {}),
    ...(input.assignedToId !== undefined ? { assignedToId: input.assignedToId } : {}),
  };

  const stageChanged = input.stage !== undefined && input.stage !== current.stage;
  if (stageChanged && input.stage) {
    data.stage = input.stage;
    data.stageChangedAt = new Date();
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.lead.update({ where: { id }, data });
    if (stageChanged && input.stage) {
      await logSystem(
        transaction,
        id,
        `Étape : ${STAGE_LABEL[current.stage]} → ${STAGE_LABEL[input.stage]}.`,
        actorId,
      );
    }
    if (input.assignedToId !== undefined && input.assignedToId !== current.assignedToId) {
      await logSystem(
        transaction,
        id,
        input.assignedToId ? 'Responsable modifié.' : 'Lead désassigné.',
        actorId,
      );
    }
  });

  return toDto(await getLeadOrThrow(id));
}

export async function markLeadWon(id: string, actorId: string) {
  const current = await getLeadOrThrow(id);
  if (current.status === 'GAGNE') return toDto(current);

  await prisma.$transaction(async (transaction) => {
    await transaction.lead.update({
      where: { id },
      data: { status: 'GAGNE', wonAt: new Date(), lostAt: null, lostReason: null },
    });
    await logSystem(transaction, id, 'Lead marqué comme gagné.', actorId);
  });
  return toDto(await getLeadOrThrow(id));
}

export async function markLeadLost(id: string, reason: string, actorId: string) {
  const current = await getLeadOrThrow(id);
  if (current.status === 'PERDU') return toDto(current);

  await prisma.$transaction(async (transaction) => {
    await transaction.lead.update({
      where: { id },
      data: { status: 'PERDU', lostAt: new Date(), wonAt: null, lostReason: reason },
    });
    await logSystem(transaction, id, `Lead marqué comme perdu : ${reason}`, actorId);
  });
  return toDto(await getLeadOrThrow(id));
}

export async function reopenLead(id: string, actorId: string) {
  const current = await getLeadOrThrow(id);
  if (current.status === 'OUVERT') return toDto(current);

  await prisma.$transaction(async (transaction) => {
    await transaction.lead.update({
      where: { id },
      data: { status: 'OUVERT', wonAt: null, lostAt: null, lostReason: null, stageChangedAt: new Date() },
    });
    await logSystem(transaction, id, 'Lead rouvert.', actorId);
  });
  return toDto(await getLeadOrThrow(id));
}

export async function deleteLead(id: string) {
  await getLeadOrThrow(id);
  await prisma.lead.delete({ where: { id } });
}

// --- Activités -------------------------------------------------------------------

export async function addActivity(leadId: string, input: CreateActivityInput, actorId: string) {
  await getLeadOrThrow(leadId);

  const activity = await prisma.$transaction(async (transaction) => {
    const created = await transaction.leadActivity.create({
      data: {
        leadId,
        authorId: actorId,
        type: input.type as LeadActivityType,
        content: input.content,
        dueAt: input.dueAt ?? null,
        // Sans échéance : c'est une entrée de journal, déjà réalisée.
        doneAt: input.dueAt ? null : new Date(),
      },
      include: { author: { select: staffSelect } },
    });
    await refreshNextActivity(transaction, leadId);
    return created;
  });
  return activity;
}

export async function completeActivity(activityId: string) {
  const current = await prisma.leadActivity.findUnique({ where: { id: activityId } });
  if (!current) throw AppError.notFound('Activité introuvable.');
  if (current.doneAt) return current;

  return prisma.$transaction(async (transaction) => {
    const done = await transaction.leadActivity.update({
      where: { id: activityId },
      data: { doneAt: new Date() },
      include: { author: { select: staffSelect } },
    });
    await refreshNextActivity(transaction, current.leadId);
    return done;
  });
}

export async function deleteActivity(activityId: string) {
  const current = await prisma.leadActivity.findUnique({ where: { id: activityId } });
  if (!current) throw AppError.notFound('Activité introuvable.');
  if (current.type === 'SYSTEME') throw AppError.forbidden('Les événements système ne peuvent pas être supprimés.');

  await prisma.$transaction(async (transaction) => {
    await transaction.leadActivity.delete({ where: { id: activityId } });
    await refreshNextActivity(transaction, current.leadId);
  });
}

export async function listStaff() {
  return prisma.user.findMany({
    where: { actif: true, role: { in: ['ADMIN', 'GESTIONNAIRE'] } },
    select: staffSelect,
    orderBy: { email: 'asc' },
  });
}

// --- Formulaire public ------------------------------------------------------------

export async function createPublicLead(input: PublicLeadInput) {
  // Robot : on répond comme si tout allait bien, sans rien enregistrer.
  if (input.website) return { received: true };

  const email = input.email.toLowerCase();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicate = await prisma.lead.findFirst({
    where: { email, status: 'OUVERT', createdAt: { gte: since } },
    select: { id: true },
  });

  const summary = [
    input.message ? `Message : ${input.message}` : null,
    input.phone ? `Téléphone : ${input.phone}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (duplicate) {
    await logSystem(prisma, duplicate.id, `Nouvelle demande via le site.${summary ? `\n${summary}` : ''}`, null);
    return { received: true };
  }

  const lead = await withReference(async (reference, transaction) => {
    const created = await transaction.lead.create({
      data: {
        reference,
        title: `${input.companyName?.trim() || input.contactName} — demande de contact`,
        contactName: input.contactName,
        email,
        phone: input.phone ?? null,
        companyName: input.companyName ?? null,
        type: input.profile as LeadType,
        source: input.source as LeadSource,
        message: input.message ?? null,
      },
      select: { id: true, title: true },
    });
    await logSystem(transaction, created.id, 'Lead créé depuis le formulaire du site.', null);
    return created;
  });

  // Prévient l'équipe dans l'application.
  const staff = await listStaff();
  if (staff.length > 0) {
    await prisma.notification.createMany({
      data: staff.map((member) => ({
        userId: member.id,
        type: 'LEAD_NOUVEAU',
        titre: 'Nouveau lead',
        message: `${lead.title}`,
        lienUrl: `/admin/crm/${lead.id}`,
        canal: 'IN_APP' as const,
      })),
    });
  }

  return { received: true };
}

// --- Synchronisation avec les candidatures ----------------------------------------

/**
 * Crée ou met à jour le lead lié à une candidature. Appelée après le dépôt et
 * après chaque décision ; elle ne doit jamais faire échouer l'opération métier.
 */
export async function syncLeadFromApplication(applicationId: string): Promise<void> {
  const application = await prisma.candidature.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      statut: true,
      score: true,
      motifDecision: true,
      startup: {
        select: { nom: true, user: { select: { email: true } } },
      },
    },
  });
  if (!application) return;

  const existing = await prisma.lead.findUnique({ where: { candidatureId: application.id } });

  if (!existing) {
    await withReference(async (reference, transaction) => {
      const lead = await transaction.lead.create({
        data: {
          reference,
          title: `Candidature — ${application.startup.nom}`,
          contactName: application.startup.nom,
          email: application.startup.user.email,
          companyName: application.startup.nom,
          type: 'STARTUP',
          source: 'CANDIDATURE',
          score: application.score,
          candidatureId: application.id,
        },
        select: { id: true },
      });
      await logSystem(transaction, lead.id, 'Lead créé depuis une candidature au programme.', null);
    });
    return;
  }

  if (existing.status !== 'OUVERT' && application.statut !== 'REFUSEE') return;

  if (application.statut === 'ACCEPTEE' && existing.stage === 'NOUVEAU' && existing.status === 'OUVERT') {
    await prisma.$transaction(async (transaction) => {
      await transaction.lead.update({
        where: { id: existing.id },
        data: { stage: 'DIAGNOSTIC', stageChangedAt: new Date(), score: application.score },
      });
      await logSystem(transaction, existing.id, 'Candidature acceptée : entrée dans le parcours (Diagnostic).', null);
    });
    return;
  }

  if (application.statut === 'REFUSEE' && existing.status === 'OUVERT') {
    const reason = application.motifDecision?.slice(0, 180) || 'Candidature refusée';
    await prisma.$transaction(async (transaction) => {
      await transaction.lead.update({
        where: { id: existing.id },
        data: { status: 'PERDU', lostAt: new Date(), lostReason: reason, score: application.score },
      });
      await logSystem(transaction, existing.id, `Candidature refusée : ${reason}`, null);
    });
    return;
  }

  if (application.score !== null && application.score !== existing.score) {
    await prisma.lead.update({ where: { id: existing.id }, data: { score: application.score } });
  }
}

// --- Indicateurs --------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000;

export async function getStats() {
  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * DAY);
  const d60 = new Date(now.getTime() - 60 * DAY);
  const d56 = new Date(now.getTime() - 56 * DAY);

  const [open, won, lost, created30, created60, byStageRaw, bySourceRaw, byTypeRaw, overdue, recent, upcoming, wonRows] =
    await Promise.all([
      prisma.lead.count({ where: { status: 'OUVERT' } }),
      prisma.lead.count({ where: { status: 'GAGNE' } }),
      prisma.lead.count({ where: { status: 'PERDU' } }),
      prisma.lead.count({ where: { createdAt: { gte: d30 } } }),
      prisma.lead.count({ where: { createdAt: { gte: d60, lt: d30 } } }),
      prisma.lead.groupBy({ by: ['stage'], where: { status: 'OUVERT' }, _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['type'], _count: { _all: true } }),
      prisma.leadActivity.count({ where: { doneAt: null, dueAt: { lt: now } } }),
      prisma.lead.findMany({ where: { createdAt: { gte: d56 } }, select: { createdAt: true } }),
      prisma.leadActivity.findMany({
        where: { doneAt: null, dueAt: { not: null } },
        orderBy: { dueAt: 'asc' },
        take: 6,
        include: {
          lead: { select: { id: true, title: true, reference: true } },
          author: { select: staffSelect },
        },
      }),
      prisma.lead.findMany({ where: { status: 'GAGNE', wonAt: { not: null } }, select: { createdAt: true, wonAt: true }, take: 500 }),
    ]);

  const stageCount = new Map(byStageRaw.map((row) => [row.stage, row._count._all]));
  const byStage = LEAD_STAGES.map((stage) => ({
    stage,
    label: STAGE_LABEL[stage],
    probability: STAGE_PROBABILITY[stage],
    count: stageCount.get(stage) ?? 0,
  }));

  const weightedOpen = byStage.reduce((sum, row) => sum + (row.count * row.probability) / 100, 0);
  const closed = won + lost;

  // Nouveaux leads par semaine sur les huit dernières semaines.
  const weekly = Array.from({ length: 8 }, (_, index) => {
    const start = new Date(now.getTime() - (7 - index + 1) * 7 * DAY);
    const end = new Date(now.getTime() - (7 - index) * 7 * DAY);
    const count = recent.filter((row) => row.createdAt >= start && row.createdAt < end).length;
    return { weekStart: start.toISOString(), count };
  });

  const avgDaysToWin =
    wonRows.length > 0
      ? Math.round(
          wonRows.reduce((sum, row) => sum + ((row.wonAt as Date).getTime() - row.createdAt.getTime()) / DAY, 0) /
            wonRows.length,
        )
      : null;

  return {
    totals: { open, won, lost, all: open + won + lost },
    created30,
    created60,
    conversionRate: closed > 0 ? Math.round((won / closed) * 100) : null,
    weightedOpen: Math.round(weightedOpen * 10) / 10,
    avgDaysToWin,
    overdueActivities: overdue,
    byStage,
    bySource: bySourceRaw.map((row) => ({ source: row.source, count: row._count._all })),
    byType: byTypeRaw.map((row) => ({ type: row.type, count: row._count._all })),
    weekly,
    upcoming,
  };
}
