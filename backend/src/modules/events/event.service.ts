import { AppError } from '../../errors/app-error.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { EventRegistrationStatus } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import type {
  CreateEventInput,
  PatchEventInput,
  PublicEventsQuery,
  RegisterInput,
} from './event.schemas.js';

// Une inscription « annulée » libère sa place ; les autres la comptent.
const ACTIVE: EventRegistrationStatus[] = ['REGISTERED', 'ATTENDED'];

const eventSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  description: true,
  type: true,
  origin: true,
  status: true,
  location: true,
  startAt: true,
  endAt: true,
  capacity: true,
  coverImage: true,
  videoUrl: true,
  coOrganizerName: true,
  registrationsOpen: true,
  createdAt: true,
} as const;

type EventRow = Prisma.EventGetPayload<{ select: typeof eventSelect }>;

async function activeCounts(eventIds: string[]): Promise<Map<string, number>> {
  if (eventIds.length === 0) return new Map();
  const groups = await prisma.eventRegistration.groupBy({
    by: ['eventId'],
    where: { eventId: { in: eventIds }, status: { in: ACTIVE } },
    _count: { _all: true },
  });
  return new Map(groups.map((g) => [g.eventId, g._count._all]));
}

// La phase se déduit des dates à chaque lecture : rien à planifier, l'évènement
// passe tout seul de « à venir » à « en cours » puis « passé ».
function phaseOf(event: { startAt: Date; endAt: Date }, now = Date.now()): 'UPCOMING' | 'ONGOING' | 'PAST' {
  if (event.endAt.getTime() < now) return 'PAST';
  if (event.startAt.getTime() <= now) return 'ONGOING';
  return 'UPCOMING';
}

function toDto(event: EventRow, registered: number) {
  const remaining = Math.max(event.capacity - registered, 0);
  const phase = phaseOf(event);
  const finished = phase === 'PAST';
  return {
    ...event,
    phase,
    registeredCount: registered,
    spotsLeft: remaining,
    isFull: remaining === 0,
    isPast: finished,
    canRegister: event.status === 'PUBLISHED' && event.registrationsOpen && !finished && remaining > 0,
  };
}

async function withCounts(events: EventRow[]) {
  const counts = await activeCounts(events.map((e) => e.id));
  return events.map((e) => toDto(e, counts.get(e.id) ?? 0));
}

// Prisma (exactOptionalPropertyTypes) refuse les clés à `undefined` : on les retire.
function compact<T extends object>(value: T): { [K in keyof T]: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as {
    [K in keyof T]: Exclude<T[K], undefined>;
  };
}

function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'evenement'
  );
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const clash = await prisma.event.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!clash) return candidate;
  }
  return `${base}-${Date.now()}`;
}

// ---------------------------------------------------------------- public

export async function listPublicEvents(query: PublicEventsQuery) {
  const now = new Date();
  const where: Prisma.EventWhereInput = { status: 'PUBLISHED' };
  if (query.scope === 'upcoming') where.endAt = { gte: now };
  if (query.scope === 'past') where.endAt = { lt: now };

  const events = await prisma.event.findMany({
    where,
    select: eventSelect,
    orderBy: { startAt: query.scope === 'past' ? 'desc' : 'asc' },
    take: query.limit,
  });
  return withCounts(events);
}

export async function getPublicEvent(slug: string) {
  const event = await prisma.event.findFirst({ where: { slug, status: 'PUBLISHED' }, select: eventSelect });
  if (!event) throw AppError.notFound('Évènement introuvable.');
  return (await withCounts([event]))[0]!;
}

export async function registerToEvent(slug: string, input: RegisterInput) {
  // Robot : on répond comme si tout allait bien, sans rien enregistrer.
  if (input.website) return { registered: true };

  const email = input.email.toLowerCase();

  // Vérification de capacité et création dans une même transaction, pour ne
  // pas dépasser le nombre de places sur des envois simultanés.
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findFirst({ where: { slug, status: 'PUBLISHED' }, select: eventSelect });
    if (!event) throw AppError.notFound('Évènement introuvable.');
    if (event.endAt.getTime() < Date.now()) throw AppError.conflict('Cet évènement est passé : les inscriptions sont closes.');
    if (!event.registrationsOpen) throw AppError.conflict('Les inscriptions à cet évènement sont closes.');

    const existing = await tx.eventRegistration.findUnique({
      where: { eventId_email: { eventId: event.id, email } },
      select: { id: true, status: true },
    });
    if (existing && existing.status !== 'CANCELLED') {
      throw AppError.conflict('Cette adresse email est déjà inscrite à cet évènement.');
    }

    const taken = await tx.eventRegistration.count({
      where: { eventId: event.id, status: { in: ACTIVE } },
    });
    if (taken >= event.capacity) throw AppError.conflict('Cet évènement est complet.');

    const data = {
      fullName: input.fullName,
      phone: input.phone ?? null,
      organization: input.organization ?? null,
      message: input.message ?? null,
      status: 'REGISTERED' as const,
    };
    if (existing) {
      await tx.eventRegistration.update({ where: { id: existing.id }, data });
    } else {
      await tx.eventRegistration.create({ data: { ...data, email, eventId: event.id } });
    }
    return { registered: true, spotsLeft: Math.max(event.capacity - taken - 1, 0) };
  });
}

// ----------------------------------------------------------------- admin

export async function listAdminEvents() {
  const events = await prisma.event.findMany({
    select: eventSelect,
    orderBy: [{ startAt: 'desc' }, { id: 'asc' }],
  });
  return withCounts(events);
}

export async function createEvent(input: CreateEventInput, actorId: string) {
  const slug = await uniqueSlug(input.title);
  const created = await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: { ...compact(input), slug, createdById: actorId },
      select: eventSelect,
    });
    await tx.auditLog.create({
      data: { userId: actorId, action: 'EVENEMENT_CREE', entite: 'Event', entiteId: event.id, meta: { status: event.status } },
    });
    return event;
  });
  return toDto(created, 0);
}

export async function patchEvent(id: string, input: PatchEventInput, actorId: string) {
  const current = await prisma.event.findUnique({ where: { id }, select: { startAt: true, endAt: true } });
  if (!current) throw AppError.notFound('Évènement introuvable.');

  // Une date modifiée seule doit rester cohérente avec l'autre déjà enregistrée.
  const startAt = input.startAt ?? current.startAt;
  const endAt = input.endAt ?? current.endAt;
  if (endAt <= startAt) {
    throw AppError.badRequest('Les données envoyées sont invalides.', {
      endAt: ['La fin doit être postérieure au début.'],
    });
  }

  if (input.capacity !== undefined) {
    const taken = await prisma.eventRegistration.count({ where: { eventId: id, status: { in: ACTIVE } } });
    if (input.capacity < taken) {
      throw AppError.conflict(`${taken} personnes sont déjà inscrites : la capacité ne peut pas être inférieure.`);
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const event = await tx.event.update({ where: { id }, data: compact(input), select: eventSelect });
    await tx.auditLog.create({
      data: { userId: actorId, action: 'EVENEMENT_MODIFIE', entite: 'Event', entiteId: id, meta: { champs: Object.keys(input) } },
    });
    return event;
  });
  return (await withCounts([updated]))[0]!;
}

export async function deleteEvent(id: string, actorId: string) {
  const event = await prisma.event.findUnique({ where: { id }, select: { id: true, title: true } });
  if (!event) throw AppError.notFound('Évènement introuvable.');
  await prisma.$transaction([
    prisma.event.delete({ where: { id } }),
    prisma.auditLog.create({
      data: { userId: actorId, action: 'EVENEMENT_SUPPRIME', entite: 'Event', entiteId: id, meta: { title: event.title } },
    }),
  ]);
}

export async function listRegistrations(eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
  if (!event) throw AppError.notFound('Évènement introuvable.');
  return prisma.eventRegistration.findMany({
    where: { eventId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      organization: true,
      message: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function patchRegistration(
  eventId: string,
  registrationId: string,
  status: EventRegistrationStatus,
  actorId: string,
) {
  const registration = await prisma.eventRegistration.findFirst({
    where: { id: registrationId, eventId },
    select: { id: true, status: true },
  });
  if (!registration) throw AppError.notFound('Inscription introuvable.');

  // Rétablir une inscription annulée reprend une place : on revérifie la capacité.
  if (registration.status === 'CANCELLED' && status !== 'CANCELLED') {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { capacity: true } });
    const taken = await prisma.eventRegistration.count({ where: { eventId, status: { in: ACTIVE } } });
    if (event && taken >= event.capacity) throw AppError.conflict('Cet évènement est complet.');
  }

  const updated = await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { status },
    select: { id: true, status: true },
  });
  await prisma.auditLog.create({
    data: { userId: actorId, action: 'INSCRIPTION_MODIFIEE', entite: 'EventRegistration', entiteId: registrationId, meta: { status } },
  });
  return updated;
}
