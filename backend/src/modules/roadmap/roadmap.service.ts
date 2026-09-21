import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { Role } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import type {
  CreateObjectiveInput,
  CreateTaskInput,
  PatchObjectiveInput,
  PatchTaskInput,
} from './roadmap.schemas.js';

export interface RoadmapActor {
  userId: string;
  role: Role;
}

const taskSelect = {
  id: true,
  objectifId: true,
  titre: true,
  statut: true,
  assigneA: true,
  creePar: true,
  dateEcheance: true,
} satisfies Prisma.TacheSelect;

const objectiveSelect = {
  id: true,
  titre: true,
  description: true,
  dateEcheance: true,
  statut: true,
  creePar: true,
} satisfies Prisma.ObjectifSelect;

const objectiveWithTasksSelect = {
  ...objectiveSelect,
  taches: {
    select: taskSelect,
    orderBy: [{ dateEcheance: 'asc' }, { id: 'asc' }],
  },
} satisfies Prisma.ObjectifSelect;

export type RoadmapObjective = Prisma.ObjectifGetPayload<{
  select: typeof objectiveWithTasksSelect;
}>;
export type RoadmapTask = Prisma.TacheGetPayload<{ select: typeof taskSelect }>;

async function ensureStartupAccess(
  startupId: string,
  actor: RoadmapActor,
): Promise<{ id: string; nom: string }> {
  const startup = await prisma.startupProfile.findUnique({
    where: { id: startupId },
    select: { id: true, userId: true, nom: true },
  });

  if (!startup) {
    throw AppError.notFound('Startup introuvable.');
  }

  if (actor.role === 'PORTEUR_STARTUP' && startup.userId !== actor.userId) {
    throw AppError.forbidden("Vous n'avez pas accès à la roadmap de cette startup.");
  }

  return { id: startup.id, nom: startup.nom };
}

async function ensureObjectiveBelongsToStartup(
  startupId: string,
  objectiveId: string,
): Promise<void> {
  const objective = await prisma.objectif.findFirst({
    where: { id: objectiveId, startupId },
    select: { id: true },
  });

  if (!objective) {
    throw AppError.notFound('Objectif introuvable pour cette startup.');
  }
}

async function ensureAssigneeAllowed(
  assigneeId: string | null | undefined,
  startupId: string,
): Promise<void> {
  if (assigneeId === undefined || assigneeId === null) return;

  const startup = await prisma.startupProfile.findUnique({
    where: { id: startupId },
    select: { userId: true },
  });

  if (!startup || assigneeId !== startup.userId) {
    throw AppError.forbidden("Une startup ne peut assigner une tâche qu'à son propre compte.");
  }

  const assignee = await prisma.user.findFirst({
    where: { id: assigneeId, actif: true },
    select: { id: true },
  });

  if (!assignee) {
    throw AppError.badRequest("Le compte assigné n'existe pas ou est inactif.");
  }
}

function objectiveUpdateData(input: PatchObjectiveInput): Prisma.ObjectifUpdateInput {
  return {
    ...(input.titre !== undefined ? { titre: input.titre } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.dateEcheance !== undefined ? { dateEcheance: input.dateEcheance } : {}),
    ...(input.statut !== undefined ? { statut: input.statut } : {}),
  };
}

function taskUpdateData(input: PatchTaskInput): Prisma.TacheUncheckedUpdateInput {
  return {
    ...(input.titre !== undefined ? { titre: input.titre } : {}),
    ...(input.objectifId !== undefined ? { objectifId: input.objectifId } : {}),
    ...(input.assigneA !== undefined ? { assigneA: input.assigneA } : {}),
    ...(input.dateEcheance !== undefined ? { dateEcheance: input.dateEcheance } : {}),
    ...(input.statut !== undefined ? { statut: input.statut } : {}),
  };
}

export async function getRoadmap(startupId: string, actor: RoadmapActor): Promise<{
  startup: { id: string; nom: string };
  objectives: RoadmapObjective[];
  unassignedTasks: RoadmapTask[];
}> {
  const startup = await ensureStartupAccess(startupId, actor);
  const [objectives, unassignedTasks] = await Promise.all([
    prisma.objectif.findMany({
      where: { startupId },
      select: objectiveWithTasksSelect,
      orderBy: [{ dateEcheance: 'asc' }, { id: 'asc' }],
    }),
    prisma.tache.findMany({
      where: { startupId, objectifId: null },
      select: taskSelect,
      orderBy: [{ dateEcheance: 'asc' }, { id: 'asc' }],
    }),
  ]);

  return { startup, objectives, unassignedTasks };
}

export async function createObjective(
  startupId: string,
  actor: RoadmapActor,
  input: CreateObjectiveInput,
): Promise<Prisma.ObjectifGetPayload<{ select: typeof objectiveSelect }>> {
  await ensureStartupAccess(startupId, actor);

  return prisma.objectif.create({
    data: {
      startupId,
      creePar: actor.userId,
      titre: input.titre,
      statut: input.statut,
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.dateEcheance !== undefined ? { dateEcheance: input.dateEcheance } : {}),
    },
    select: objectiveSelect,
  });
}

export async function patchObjective(
  startupId: string,
  objectiveId: string,
  actor: RoadmapActor,
  input: PatchObjectiveInput,
): Promise<Prisma.ObjectifGetPayload<{ select: typeof objectiveSelect }>> {
  await ensureStartupAccess(startupId, actor);
  await ensureObjectiveBelongsToStartup(startupId, objectiveId);

  return prisma.objectif.update({
    where: { id: objectiveId, startupId },
    data: objectiveUpdateData(input),
    select: objectiveSelect,
  });
}

export async function deleteObjective(
  startupId: string,
  objectiveId: string,
  actor: RoadmapActor,
): Promise<void> {
  await ensureStartupAccess(startupId, actor);

  await prisma.$transaction(async (transaction) => {
    const objective = await transaction.objectif.findFirst({
      where: { id: objectiveId, startupId },
      select: { id: true },
    });

    if (!objective) {
      throw AppError.notFound('Objectif introuvable pour cette startup.');
    }

    await transaction.tache.updateMany({
      where: { startupId, objectifId: objective.id },
      data: { objectifId: null },
    });
    await transaction.objectif.delete({
      where: { id: objective.id, startupId },
    });
  });
}

export async function createTask(
  startupId: string,
  actor: RoadmapActor,
  input: CreateTaskInput,
): Promise<RoadmapTask> {
  await ensureStartupAccess(startupId, actor);

  if (input.objectifId) {
    await ensureObjectiveBelongsToStartup(startupId, input.objectifId);
  }
  await ensureAssigneeAllowed(input.assigneA, startupId);

  return prisma.tache.create({
    data: {
      startupId,
      creePar: actor.userId,
      titre: input.titre,
      statut: input.statut,
      ...(input.objectifId !== undefined ? { objectifId: input.objectifId } : {}),
      ...(input.assigneA !== undefined ? { assigneA: input.assigneA } : {}),
      ...(input.dateEcheance !== undefined ? { dateEcheance: input.dateEcheance } : {}),
    },
    select: taskSelect,
  });
}

export async function patchTask(
  startupId: string,
  taskId: string,
  actor: RoadmapActor,
  input: PatchTaskInput,
): Promise<RoadmapTask> {
  await ensureStartupAccess(startupId, actor);
  const task = await prisma.tache.findFirst({
    where: { id: taskId, startupId },
    select: { id: true },
  });

  if (!task) {
    throw AppError.notFound('Tâche introuvable pour cette startup.');
  }

  if (input.objectifId) {
    await ensureObjectiveBelongsToStartup(startupId, input.objectifId);
  }
  await ensureAssigneeAllowed(input.assigneA, startupId);

  return prisma.tache.update({
    where: { id: task.id, startupId },
    data: taskUpdateData(input),
    select: taskSelect,
  });
}

export async function deleteTask(
  startupId: string,
  taskId: string,
  actor: RoadmapActor,
): Promise<void> {
  await ensureStartupAccess(startupId, actor);
  const deleted = await prisma.tache.deleteMany({
    where: { id: taskId, startupId },
  });

  if (deleted.count !== 1) {
    throw AppError.notFound('Tâche introuvable pour cette startup.');
  }
}
