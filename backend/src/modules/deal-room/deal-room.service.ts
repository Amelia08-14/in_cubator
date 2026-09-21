import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { Role } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import type {
  AccessRequestDecisionInput,
  AccessRequestListQuery,
  CreateAccessRequestInput,
  CreateDealRoomDocumentInput,
  DealRoomDocumentListQuery,
  PatchDealRoomDocumentInput,
} from './deal-room.schemas.js';

const accessRequestSelect = {
  id: true,
  statut: true,
  dateAcces: true,
  createdAt: true,
  startup: {
    select: {
      id: true,
      nom: true,
      logoUrl: true,
      stade: true,
    },
  },
  investisseur: {
    select: {
      id: true,
      organisation: true,
      typeInvestisseur: true,
      logoUrl: true,
    },
  },
  accordePar: {
    select: {
      id: true,
      role: true,
    },
  },
} satisfies Prisma.AccesDealRoomSelect;

const dealRoomDocumentSelect = {
  id: true,
  type: true,
  fichierUrl: true,
  version: true,
  visibleInvestisseurs: true,
  createdAt: true,
} satisfies Prisma.DocumentSelect;

export interface DealRoomActor {
  userId: string;
  role: Role;
}

export type AccessRequestDto = Prisma.AccesDealRoomGetPayload<{
  select: typeof accessRequestSelect;
}>;

export type DealRoomDocumentDto = Prisma.DocumentGetPayload<{
  select: typeof dealRoomDocumentSelect;
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

async function accessRequestScope(actor: DealRoomActor): Promise<Prisma.AccesDealRoomWhereInput> {
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

  throw AppError.forbidden('Ce rôle ne peut pas consulter les demandes Deal Room.');
}

export async function createAccessRequest(
  actor: DealRoomActor,
  input: CreateAccessRequestInput,
): Promise<AccessRequestDto> {
  if (actor.role !== 'INVESTISSEUR') {
    throw AppError.forbidden('Seul un investisseur peut demander cet accès.');
  }

  const [investor, startup] = await Promise.all([
    prisma.investorProfile.findFirst({
      where: {
        userId: actor.userId,
        user: { actif: true, role: 'INVESTISSEUR' },
      },
      select: {
        id: true,
        organisation: true,
      },
    }),
    prisma.startupProfile.findFirst({
      where: {
        id: input.startupId,
        user: { actif: true },
      },
      select: {
        id: true,
        userId: true,
        nom: true,
      },
    }),
  ]);

  if (!investor) {
    throw AppError.notFound('Profil investisseur introuvable.');
  }

  if (!startup) {
    throw AppError.notFound('Startup introuvable.');
  }

  const existing = await prisma.accesDealRoom.findUnique({
    where: {
      startupId_investisseurId: {
        startupId: startup.id,
        investisseurId: investor.id,
      },
    },
    select: { id: true },
  });

  if (existing) {
    throw AppError.conflict("Une demande d'accès existe déjà pour cette startup.");
  }

  return prisma.$transaction(async (transaction) => {
    const request = await transaction.accesDealRoom.create({
      data: {
        startupId: startup.id,
        investisseurId: investor.id,
        statut: 'DEMANDE',
      },
      select: accessRequestSelect,
    });

    await transaction.notification.create({
      data: {
        userId: startup.userId,
        type: 'DEMANDE_ACCES_DEAL_ROOM',
        titre: "Nouvelle demande d'accès Deal Room",
        message: `${investor.organisation ?? 'Un investisseur'} souhaite accéder à la Deal Room de ${startup.nom}.`,
        lienUrl: '/espace/deal-room/acces',
        canal: 'IN_APP',
      },
    });

    return request;
  });
}

export async function listAccessRequests(
  actor: DealRoomActor,
  input: AccessRequestListQuery,
): Promise<{ items: AccessRequestDto[]; pagination: Pagination }> {
  const scope = await accessRequestScope(actor);
  const filters: Prisma.AccesDealRoomWhereInput = {
    ...(input.statut ? { statut: input.statut } : {}),
    ...(input.startupId ? { startupId: input.startupId } : {}),
    ...(input.investisseurId ? { investisseurId: input.investisseurId } : {}),
  };
  const where: Prisma.AccesDealRoomWhereInput = { AND: [scope, filters] };
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.accesDealRoom.findMany({
      where,
      select: accessRequestSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.accesDealRoom.count({ where }),
  ]);

  return {
    items,
    pagination: pagination(input.page, input.pageSize, totalItems),
  };
}

function decisionScope(actor: DealRoomActor): Prisma.AccesDealRoomWhereInput {
  if (isAdministrative(actor.role)) {
    return {};
  }

  if (actor.role === 'PORTEUR_STARTUP') {
    return {
      startup: {
        userId: actor.userId,
        user: { actif: true, role: 'PORTEUR_STARTUP' },
      },
    };
  }

  throw AppError.forbidden('Ce rôle ne peut pas décider une demande Deal Room.');
}

export async function decideAccessRequest(
  actor: DealRoomActor,
  requestId: string,
  input: AccessRequestDecisionInput,
): Promise<AccessRequestDto> {
  const scope = decisionScope(actor);
  const expectedStatus = input.statut === 'REVOQUE' ? 'ACCORDE' : 'DEMANDE';
  const decidedAt = new Date();

  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.accesDealRoom.findFirst({
      where: { AND: [{ id: requestId }, scope] },
      select: {
        id: true,
        startupId: true,
        investisseurId: true,
        statut: true,
      },
    });

    if (!existing) {
      throw AppError.notFound('Demande Deal Room introuvable.');
    }

    if (existing.statut !== expectedStatus) {
      throw AppError.conflict(
        input.statut === 'REVOQUE'
          ? 'Seul un accès accordé peut être révoqué.'
          : 'Cette demande a déjà été traitée.',
      );
    }

    const updated = await transaction.accesDealRoom.updateMany({
      where: {
        AND: [{ id: requestId, statut: expectedStatus }, scope],
      },
      data: {
        statut: input.statut,
        accordeParId: actor.userId,
        ...(input.statut === 'ACCORDE' ? { dateAcces: decidedAt } : {}),
        ...(input.statut === 'REFUSE' ? { dateAcces: null } : {}),
      },
    });

    if (updated.count !== 1) {
      throw AppError.conflict('Cette demande a été modifiée par une autre opération.');
    }

    await transaction.auditLog.create({
      data: {
        userId: actor.userId,
        action: `DEAL_ROOM_ACCESS_${input.statut}`,
        entite: 'AccesDealRoom',
        entiteId: existing.id,
        meta: {
          startupId: existing.startupId,
          investisseurId: existing.investisseurId,
          previousStatus: existing.statut,
          nextStatus: input.statut,
        },
      },
    });

    const request = await transaction.accesDealRoom.findUnique({
      where: { id: requestId },
      select: accessRequestSelect,
    });

    if (!request) {
      throw AppError.notFound('Demande Deal Room introuvable.');
    }

    return request;
  });
}

async function authorizedDocumentWhere(
  actor: DealRoomActor,
  startupId: string,
): Promise<Prisma.DocumentWhereInput> {
  if (isAdministrative(actor.role)) {
    const startup = await prisma.startupProfile.findUnique({
      where: { id: startupId },
      select: { id: true },
    });

    if (!startup) {
      throw AppError.notFound('Startup introuvable.');
    }

    return { startupId };
  }

  if (actor.role === 'PORTEUR_STARTUP') {
    const startup = await prisma.startupProfile.findFirst({
      where: {
        id: startupId,
        userId: actor.userId,
        user: { actif: true, role: 'PORTEUR_STARTUP' },
      },
      select: { id: true },
    });

    if (!startup) {
      throw AppError.notFound('Deal Room introuvable.');
    }

    return { startupId: startup.id };
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

    const access = await prisma.accesDealRoom.findUnique({
      where: {
        startupId_investisseurId: {
          startupId,
          investisseurId: investor.id,
        },
      },
      select: { statut: true },
    });

    if (access?.statut !== 'ACCORDE') {
      throw AppError.forbidden("L'accès à cette Deal Room n'est pas accordé.");
    }

    return {
      startupId,
      visibleInvestisseurs: true,
      startup: {
        accesDealRoom: {
          some: {
            investisseurId: investor.id,
            statut: 'ACCORDE',
          },
        },
      },
    };
  }

  throw AppError.forbidden('Ce rôle ne peut pas consulter une Deal Room.');
}

export async function listDealRoomDocuments(
  actor: DealRoomActor,
  startupId: string,
  input: DealRoomDocumentListQuery,
): Promise<{ items: DealRoomDocumentDto[]; pagination: Pagination }> {
  const authorization = await authorizedDocumentWhere(actor, startupId);
  const filters: Prisma.DocumentWhereInput = input.type ? { type: input.type } : {};
  const where: Prisma.DocumentWhereInput = { AND: [authorization, filters] };
  const skip = (input.page - 1) * input.pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.document.findMany({
      where,
      select: dealRoomDocumentSelect,
      orderBy: [{ type: 'asc' }, { version: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.document.count({ where }),
  ]);

  return {
    items,
    pagination: pagination(input.page, input.pageSize, totalItems),
  };
}

async function authorizedDocumentOwner(
  actor: DealRoomActor,
  startupId: string,
): Promise<{ id: string }> {
  if (isAdministrative(actor.role)) {
    const startup = await prisma.startupProfile.findUnique({
      where: { id: startupId },
      select: { id: true },
    });

    if (!startup) {
      throw AppError.notFound('Startup introuvable.');
    }

    return startup;
  }

  if (actor.role === 'PORTEUR_STARTUP') {
    const startup = await prisma.startupProfile.findFirst({
      where: {
        id: startupId,
        userId: actor.userId,
        user: { actif: true, role: 'PORTEUR_STARTUP' },
      },
      select: { id: true },
    });

    if (!startup) {
      throw AppError.forbidden('Accès non autorisé.');
    }

    return startup;
  }

  throw AppError.forbidden('Ce rôle ne peut pas modifier cette Deal Room.');
}

export async function createDealRoomDocument(
  actor: DealRoomActor,
  startupId: string,
  input: CreateDealRoomDocumentInput,
): Promise<DealRoomDocumentDto> {
  await authorizedDocumentOwner(actor, startupId);

  return prisma.document.create({
    data: {
      ...input,
      startupId,
      uploadeParId: actor.userId,
    },
    select: dealRoomDocumentSelect,
  });
}

export async function patchDealRoomDocument(
  actor: DealRoomActor,
  startupId: string,
  documentId: string,
  input: PatchDealRoomDocumentInput,
): Promise<DealRoomDocumentDto> {
  if (actor.role !== 'PORTEUR_STARTUP') {
    throw AppError.forbidden('Ce rôle ne peut pas modifier ce document.');
  }

  await authorizedDocumentOwner(actor, startupId);

  const document = await prisma.document.findFirst({
    where: { id: documentId, startupId },
    select: { id: true },
  });

  if (!document) {
    throw AppError.notFound('Document introuvable.');
  }

  return prisma.document.update({
    where: { id: documentId },
    data: { visibleInvestisseurs: input.visibleInvestisseurs },
    select: dealRoomDocumentSelect,
  });
}
