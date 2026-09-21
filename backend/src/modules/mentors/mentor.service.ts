import { randomBytes } from 'node:crypto';

import bcrypt from 'bcryptjs';

import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type {
  AdminMentorListQuery,
  CreateDisponibiliteInput,
  CreateMentorInput,
  MentorListQuery,
  PatchMentorProfileInput,
  PutMentorProfileInput,
} from './mentor.schemas.js';

const disponibiliteSelect = {
  id: true,
  dateDebut: true,
  dateFin: true,
  format: true,
  type: true,
  capacity: true,
  reservee: true,
} satisfies Prisma.DisponibiliteSelect;

export type MentorDisponibilite = Prisma.DisponibiliteGetPayload<{
  select: typeof disponibiliteSelect;
}>;

const publicMentorSelect = {
  id: true,
  nomComplet: true,
  expertise: true,
  secteurs: true,
  langues: true,
  bio: true,
  titreFonction: true,
  linkedinUrl: true,
  noteMoyenne: true,
} satisfies Prisma.MentorProfileSelect;

const ownMentorSelect = {
  ...publicMentorSelect,
  tarifIndicatif: true,
  actif: true,
} satisfies Prisma.MentorProfileSelect;

const adminMentorSelect = {
  ...ownMentorSelect,
  user: {
    select: {
      id: true,
      email: true,
      actif: true,
      createdAt: true,
    },
  },
} satisfies Prisma.MentorProfileSelect;

export type PublicMentor = Prisma.MentorProfileGetPayload<{
  select: typeof publicMentorSelect;
}>;

export type OwnMentor = Prisma.MentorProfileGetPayload<{
  select: typeof ownMentorSelect;
}>;

export type AdminMentor = Prisma.MentorProfileGetPayload<{
  select: typeof adminMentorSelect;
}>;

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

function mentorUpdateData(input: PatchMentorProfileInput): Prisma.MentorProfileUpdateInput {
  return {
    ...(input.nomComplet !== undefined ? { nomComplet: input.nomComplet } : {}),
    ...(input.expertise !== undefined ? { expertise: input.expertise } : {}),
    ...(input.secteurs !== undefined ? { secteurs: input.secteurs } : {}),
    ...(input.langues !== undefined ? { langues: input.langues } : {}),
    ...(input.bio !== undefined ? { bio: input.bio } : {}),
    ...(input.titreFonction !== undefined ? { titreFonction: input.titreFonction } : {}),
    ...(input.linkedinUrl !== undefined ? { linkedinUrl: input.linkedinUrl } : {}),
    ...(input.tarifIndicatif !== undefined ? { tarifIndicatif: input.tarifIndicatif } : {}),
  };
}

function pagination(page: number, pageSize: number, totalItems: number): Pagination {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
}

export async function listPublicMentors(input: MentorListQuery): Promise<{
  items: PublicMentor[];
  pagination: Pagination;
}> {
  const where: Prisma.MentorProfileWhereInput = {
    actif: true,
    user: { actif: true },
    ...(input.secteur ? { secteurs: { array_contains: [input.secteur] } } : {}),
    ...(input.expertise ? { expertise: { array_contains: [input.expertise] } } : {}),
    ...(input.langue ? { langues: { array_contains: [input.langue] } } : {}),
    ...(input.q
      ? {
          OR: [
            { nomComplet: { contains: input.q } },
            { titreFonction: { contains: input.q } },
            { bio: { contains: input.q } },
          ],
        }
      : {}),
  };
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.mentorProfile.findMany({
      where,
      select: publicMentorSelect,
      orderBy: [{ noteMoyenne: 'desc' }, { nomComplet: 'asc' }, { id: 'asc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.mentorProfile.count({ where }),
  ]);

  return { items, pagination: pagination(input.page, input.pageSize, totalItems) };
}

export async function getOwnMentorProfile(userId: string): Promise<OwnMentor> {
  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId },
    select: ownMentorSelect,
  });

  if (!mentor) {
    throw AppError.notFound('Profil mentor introuvable.');
  }

  return mentor;
}

export async function putOwnMentorProfile(
  userId: string,
  input: PutMentorProfileInput,
): Promise<OwnMentor> {
  return prisma.mentorProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...input,
      actif: false,
    },
    update: input,
    select: ownMentorSelect,
  });
}

export async function patchOwnMentorProfile(
  userId: string,
  input: PatchMentorProfileInput,
): Promise<OwnMentor> {
  const existing = await prisma.mentorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!existing) {
    throw AppError.notFound('Profil mentor introuvable.');
  }

  return prisma.mentorProfile.update({
    where: { userId },
    data: mentorUpdateData(input),
    select: ownMentorSelect,
  });
}

export async function listMentorsForAdmin(input: AdminMentorListQuery): Promise<{
  items: AdminMentor[];
  pagination: Pagination;
}> {
  const where: Prisma.MentorProfileWhereInput = {
    ...(input.actif !== undefined ? { actif: input.actif } : {}),
    ...(input.q
      ? {
          OR: [
            { nomComplet: { contains: input.q } },
            { user: { email: { contains: input.q } } },
          ],
        }
      : {}),
  };
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.mentorProfile.findMany({
      where,
      select: adminMentorSelect,
      orderBy: [{ actif: 'asc' }, { nomComplet: 'asc' }, { id: 'asc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.mentorProfile.count({ where }),
  ]);

  return { items, pagination: pagination(input.page, input.pageSize, totalItems) };
}

export async function createMentorForAdmin(input: CreateMentorInput): Promise<AdminMentor> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw AppError.conflict('Un compte existe déjà avec cette adresse e-mail.');
  }

  const plainPassword = input.password ?? randomBytes(9).toString('base64url');
  const passwordHash = await bcrypt.hash(plainPassword, env.BCRYPT_ROUNDS);

  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: 'MENTOR_EXPERT',
        actif: true,
      },
      select: { id: true },
    });

    return transaction.mentorProfile.create({
      data: {
        userId: user.id,
        nomComplet: input.fullName,
        expertise: input.expertise,
        secteurs: input.secteurs,
        langues: input.langues,
        bio: input.bio,
        tarifIndicatif: input.tarifIndicatif ?? null,
        noteMoyenne: 5,
        actif: true,
      },
      select: adminMentorSelect,
    });
  });
}

async function ownMentorProfileId(userId: string): Promise<string> {
  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!mentor) {
    throw AppError.notFound('Profil mentor introuvable.');
  }

  return mentor.id;
}

export async function createOwnDisponibilite(
  userId: string,
  input: CreateDisponibiliteInput,
): Promise<MentorDisponibilite> {
  const mentorId = await ownMentorProfileId(userId);

  const dateDebut = new Date(`${input.dateStr}T${input.startTime}:00`);
  const dateFin = new Date(`${input.dateStr}T${input.endTime}:00`);
  const type = input.type ?? 'Individuel';

  return prisma.disponibilite.create({
    data: {
      mentorId,
      dateDebut,
      dateFin,
      format: input.format ?? 'Visioconférence',
      type,
      capacity: type === 'Groupe' ? (input.capacity ?? 5) : null,
    },
    select: disponibiliteSelect,
  });
}

export async function deleteOwnDisponibilite(userId: string, disponibiliteId: string): Promise<void> {
  const mentorId = await ownMentorProfileId(userId);

  const slot = await prisma.disponibilite.findUnique({
    where: { id: disponibiliteId },
    select: { mentorId: true, reservee: true },
  });

  if (!slot || slot.mentorId !== mentorId) {
    throw AppError.notFound('Créneau introuvable.');
  }

  if (slot.reservee) {
    throw AppError.badRequest('Impossible de supprimer un créneau réservé.');
  }

  await prisma.disponibilite.delete({ where: { id: disponibiliteId } });
}

export async function setMentorActivation(
  mentorId: string,
  actif: boolean,
  actorId: string,
): Promise<AdminMentor> {
  const existing = await prisma.mentorProfile.findUnique({
    where: { id: mentorId },
    select: { id: true },
  });

  if (!existing) {
    throw AppError.notFound('Profil mentor introuvable.');
  }

  return prisma.$transaction(async (transaction) => {
    const mentor = await transaction.mentorProfile.update({
      where: { id: mentorId },
      data: { actif },
      select: adminMentorSelect,
    });

    await transaction.auditLog.create({
      data: {
        userId: actorId,
        action: actif ? 'MENTOR_ACTIVE' : 'MENTOR_DESACTIVE',
        entite: 'MentorProfile',
        entiteId: mentorId,
        meta: { actif },
      },
    });

    return mentor;
  });
}
