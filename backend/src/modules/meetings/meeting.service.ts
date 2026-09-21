import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { Role } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import type { BookMeetingInput, MeetingListQuery, PatchMeetingInput } from './meeting.schemas.js';

const meetingSelect = {
  id: true,
  type: true,
  statut: true,
  notes: true,
  noteMentorat: true,
  createdAt: true,
  startup: {
    select: {
      id: true,
      nom: true,
      logoUrl: true,
    },
  },
  mentor: {
    select: {
      id: true,
      nomComplet: true,
      titreFonction: true,
    },
  },
  investisseur: {
    select: {
      id: true,
      organisation: true,
      logoUrl: true,
    },
  },
  disponibilite: {
    select: {
      id: true,
      dateDebut: true,
      dateFin: true,
      format: true,
      type: true,
      capacity: true,
      reservee: true,
    },
  },
  demandePar: {
    select: {
      id: true,
      role: true,
    },
  },
} satisfies Prisma.MeetingSelect;

export interface MeetingActor {
  userId: string;
  role: Role;
}

export type MeetingDto = Prisma.MeetingGetPayload<{
  select: typeof meetingSelect;
}>;

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

function isAdministrative(role: Role): boolean {
  return role === 'ADMIN' || role === 'GESTIONNAIRE';
}

function pagination(page: number, pageSize: number, totalItems: number): Pagination {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
}

async function meetingScope(actor: MeetingActor): Promise<Prisma.MeetingWhereInput> {
  if (actor.role === 'PORTEUR_STARTUP') {
    const startup = await prisma.startupProfile.findFirst({
      where: {
        userId: actor.userId,
        user: { actif: true, role: 'PORTEUR_STARTUP' },
      },
      select: { id: true },
    });

    if (!startup) {
      throw AppError.notFound('Profil startup introuvable.');
    }

    return { startupId: startup.id };
  }

  if (actor.role === 'MENTOR_EXPERT') {
    const mentor = await prisma.mentorProfile.findFirst({
      where: {
        userId: actor.userId,
        user: { actif: true, role: 'MENTOR_EXPERT' },
      },
      select: { id: true },
    });

    if (!mentor) {
      throw AppError.notFound('Profil mentor introuvable.');
    }

    return { mentorId: mentor.id };
  }

  if (actor.role === 'INVESTISSEUR') {
    const investor = await prisma.investorProfile.findFirst({
      where: {
        userId: actor.userId,
        user: { actif: true, role: 'INVESTISSEUR' },
      },
      select: { id: true },
    });

    if (!investor) {
      throw AppError.notFound('Profil investisseur introuvable.');
    }

    return { investisseurId: investor.id };
  }

  if (isAdministrative(actor.role)) {
    return {};
  }

  throw AppError.forbidden('Ce rôle ne peut pas consulter les réunions.');
}

export async function listMeetings(
  actor: MeetingActor,
  input: MeetingListQuery,
): Promise<{ items: MeetingDto[]; pagination: Pagination }> {
  const scope = await meetingScope(actor);
  const filters: Prisma.MeetingWhereInput = {
    ...(input.type ? { type: input.type } : {}),
    ...(input.statut ? { statut: input.statut } : {}),
    ...(input.startupId ? { startupId: input.startupId } : {}),
    ...(input.mentorId ? { mentorId: input.mentorId } : {}),
    ...(input.investisseurId ? { investisseurId: input.investisseurId } : {}),
  };
  const where: Prisma.MeetingWhereInput = { AND: [scope, filters] };
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.meeting.findMany({
      where,
      select: meetingSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.meeting.count({ where }),
  ]);

  return {
    items,
    pagination: pagination(input.page, input.pageSize, totalItems),
  };
}

export async function bookMentorSlot(
  actor: MeetingActor,
  input: BookMeetingInput,
): Promise<MeetingDto> {
  if (actor.role !== 'PORTEUR_STARTUP') {
    throw AppError.forbidden('Seul un porteur de startup peut réserver ce créneau.');
  }

  const now = new Date();

  return prisma.$transaction(async (transaction) => {
    const startup = await transaction.startupProfile.findFirst({
      where: {
        userId: actor.userId,
        user: { actif: true, role: 'PORTEUR_STARTUP' },
      },
      select: { id: true },
    });

    if (!startup) {
      throw AppError.notFound('Profil startup introuvable.');
    }

    const slot = await transaction.disponibilite.findFirst({
      where: {
        id: input.disponibiliteId,
        mentor: {
          actif: true,
          user: { actif: true, role: 'MENTOR_EXPERT' },
        },
      },
      select: {
        id: true,
        mentorId: true,
        dateDebut: true,
        dateFin: true,
        capacity: true,
        reservee: true,
      },
    });

    if (!slot) {
      throw AppError.notFound('Créneau mentor introuvable.');
    }

    if (slot.reservee) {
      throw AppError.conflict('Ce créneau est déjà réservé.');
    }

    if (slot.dateDebut <= now || slot.dateFin <= slot.dateDebut) {
      throw AppError.conflict("Ce créneau n'est plus réservable.");
    }

    if (slot.capacity !== null && slot.capacity <= 0) {
      throw AppError.conflict("Ce créneau n'a aucune place disponible.");
    }

    const claimed = await transaction.disponibilite.updateMany({
      where: {
        id: slot.id,
        mentorId: slot.mentorId,
        reservee: false,
        dateDebut: { gt: now },
        dateFin: { gt: now },
        mentor: {
          actif: true,
          user: { actif: true, role: 'MENTOR_EXPERT' },
        },
      },
      data: { reservee: true },
    });

    if (claimed.count !== 1) {
      throw AppError.conflict('Ce créneau vient d’être réservé par un autre utilisateur.');
    }

    return transaction.meeting.create({
      data: {
        type: 'MENTORAT',
        startupId: startup.id,
        mentorId: slot.mentorId,
        disponibiliteId: slot.id,
        demandeParId: actor.userId,
        statut: 'DEMANDE',
      },
      select: meetingSelect,
    });
  });
}

async function ensureMeetingAccess(
  actor: MeetingActor,
  meetingId: string,
): Promise<{
  id: string;
  disponibiliteId: string | null;
  startupId: string;
  mentorId: string | null;
  investisseurId: string | null;
}> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      id: true,
      disponibiliteId: true,
      startupId: true,
      mentorId: true,
      investisseurId: true,
    },
  });

  if (!meeting) {
    throw AppError.notFound('Réunion introuvable.');
  }

  if (isAdministrative(actor.role)) {
    return meeting;
  }

  if (actor.role === 'PORTEUR_STARTUP') {
    const startup = await prisma.startupProfile.findFirst({
      where: { userId: actor.userId },
      select: { id: true },
    });
    if (!startup || meeting.startupId !== startup.id) {
      throw AppError.forbidden('Accès non autorisé.');
    }
    return meeting;
  }

  if (actor.role === 'MENTOR_EXPERT') {
    const mentor = await prisma.mentorProfile.findFirst({
      where: { userId: actor.userId },
      select: { id: true },
    });
    if (!mentor || meeting.mentorId !== mentor.id) {
      throw AppError.forbidden('Accès non autorisé.');
    }
    return meeting;
  }

  if (actor.role === 'INVESTISSEUR') {
    const investor = await prisma.investorProfile.findFirst({
      where: { userId: actor.userId },
      select: { id: true },
    });
    if (!investor || meeting.investisseurId !== investor.id) {
      throw AppError.forbidden('Accès non autorisé.');
    }
    return meeting;
  }

  throw AppError.forbidden('Ce rôle ne peut pas modifier cette réunion.');
}

export async function patchMeeting(
  actor: MeetingActor,
  meetingId: string,
  input: PatchMeetingInput,
): Promise<MeetingDto> {
  const meeting = await ensureMeetingAccess(actor, meetingId);

  return prisma.$transaction(async (transaction) => {
    const updated = await transaction.meeting.update({
      where: { id: meetingId },
      data: {
        ...(input.statut !== undefined ? { statut: input.statut } : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        ...(input.noteMentorat !== undefined ? { noteMentorat: input.noteMentorat } : {}),
      },
      select: meetingSelect,
    });

    if (input.statut === 'ANNULE' && meeting.disponibiliteId) {
      await transaction.disponibilite.update({
        where: { id: meeting.disponibiliteId },
        data: { reservee: false },
      });
    }

    return updated;
  });
}
