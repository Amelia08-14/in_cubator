import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type {
  PatchStartupProfileInput,
  PutStartupProfileInput,
  StartupListQuery,
} from './startup.schemas.js';

const publicStartupSelect = {
  id: true,
  nom: true,
  secteurs: true,
  stade: true,
  description: true,
  pitchResume: true,
  logoUrl: true,
  siteWeb: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StartupProfileSelect;

const ownStartupSelect = {
  ...publicStartupSelect,
  besoins: true,
  visiblePublic: true,
  cohorte: {
    select: {
      id: true,
      nom: true,
      dateDebut: true,
      dateFin: true,
      statut: true,
    },
  },
  membres: {
    select: {
      id: true,
      nom: true,
      role: true,
      linkedin: true,
    },
    orderBy: { nom: 'asc' },
  },
} satisfies Prisma.StartupProfileSelect;

export type PublicStartup = Prisma.StartupProfileGetPayload<{
  select: typeof publicStartupSelect;
}>;

export type OwnStartup = Prisma.StartupProfileGetPayload<{
  select: typeof ownStartupSelect;
}>;

export interface PaginatedStartups {
  items: PublicStartup[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

function startupUpdateData(input: PatchStartupProfileInput): Prisma.StartupProfileUpdateInput {
  return {
    ...(input.nom !== undefined ? { nom: input.nom } : {}),
    ...(input.secteurs !== undefined ? { secteurs: input.secteurs } : {}),
    ...(input.stade !== undefined ? { stade: input.stade } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.pitchResume !== undefined ? { pitchResume: input.pitchResume } : {}),
    ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
    ...(input.siteWeb !== undefined ? { siteWeb: input.siteWeb } : {}),
    ...(input.besoins !== undefined ? { besoins: input.besoins } : {}),
    ...(input.visiblePublic !== undefined ? { visiblePublic: input.visiblePublic } : {}),
  };
}

function publicStartupWhere(input: StartupListQuery): Prisma.StartupProfileWhereInput {
  return {
    visiblePublic: true,
    user: { actif: true },
    ...(input.stade ? { stade: input.stade } : {}),
    ...(input.secteur ? { secteurs: { array_contains: [input.secteur] } } : {}),
    ...(input.q
      ? {
          OR: [
            { nom: { contains: input.q } },
            { description: { contains: input.q } },
            { pitchResume: { contains: input.q } },
          ],
        }
      : {}),
  };
}

export async function listPublicStartups(input: StartupListQuery): Promise<PaginatedStartups> {
  const where = publicStartupWhere(input);
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.startupProfile.findMany({
      where,
      select: publicStartupSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.startupProfile.count({ where }),
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

export async function getPublicStartup(startupId: string): Promise<PublicStartup> {
  const startup = await prisma.startupProfile.findFirst({
    where: {
      id: startupId,
      visiblePublic: true,
      user: { actif: true },
    },
    select: publicStartupSelect,
  });

  if (!startup) {
    throw AppError.notFound('Startup publiée introuvable.');
  }

  return startup;
}

export async function getOwnStartupProfile(userId: string): Promise<OwnStartup> {
  const startup = await prisma.startupProfile.findUnique({
    where: { userId },
    select: ownStartupSelect,
  });

  if (!startup) {
    throw AppError.notFound('Profil startup introuvable.');
  }

  return startup;
}

export async function putOwnStartupProfile(
  userId: string,
  input: PutStartupProfileInput,
): Promise<OwnStartup> {
  return prisma.startupProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...input,
    },
    update: input,
    select: ownStartupSelect,
  });
}

export async function patchOwnStartupProfile(
  userId: string,
  input: PatchStartupProfileInput,
): Promise<OwnStartup> {
  const existing = await prisma.startupProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!existing) {
    throw AppError.notFound('Profil startup introuvable.');
  }

  return prisma.startupProfile.update({
    where: { userId },
    data: startupUpdateData(input),
    select: ownStartupSelect,
  });
}
