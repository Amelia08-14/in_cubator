import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { PutInvestorPreferencesInput } from './investor.schemas.js';

const investorProfileSelect = {
  id: true,
  organisation: true,
  typeInvestisseur: true,
  siteWeb: true,
  bio: true,
  secteursCibles: true,
  stadesCibles: true,
  ticketMin: true,
  ticketMax: true,
  zoneGeographique: true,
  emailAlerts: true,
  watchlistAlerts: true,
  logoUrl: true,
} satisfies Prisma.InvestorProfileSelect;

export type InvestorPreferences = Prisma.InvestorProfileGetPayload<{
  select: typeof investorProfileSelect;
}>;

export async function getOwnInvestorPreferences(userId: string): Promise<InvestorPreferences> {
  const profile = await prisma.investorProfile.findUnique({
    where: { userId },
    select: investorProfileSelect,
  });

  if (!profile) {
    throw AppError.notFound('Profil investisseur introuvable.');
  }

  return profile;
}

export async function putOwnInvestorPreferences(
  userId: string,
  input: PutInvestorPreferencesInput,
): Promise<InvestorPreferences> {
  const data = {
    organisation: input.organisation ?? null,
    typeInvestisseur: input.typeInvestisseur ?? null,
    siteWeb: input.siteWeb ?? null,
    bio: input.bio ?? null,
    secteursCibles: input.secteursCibles ?? [],
    stadesCibles: input.stadesCibles ?? [],
    ticketMin: input.ticketMin ?? null,
    ticketMax: input.ticketMax ?? null,
    zoneGeographique: input.zoneGeographique ?? null,
    logoUrl: input.logoUrl ?? null,
  };

  return prisma.investorProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
      emailAlerts: input.emailAlerts ?? true,
      watchlistAlerts: input.watchlistAlerts ?? true,
    },
    update: {
      ...data,
      ...(input.emailAlerts !== undefined ? { emailAlerts: input.emailAlerts } : {}),
      ...(input.watchlistAlerts !== undefined ? { watchlistAlerts: input.watchlistAlerts } : {}),
    },
    select: investorProfileSelect,
  });
}
