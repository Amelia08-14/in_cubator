import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

import { env } from '../../config/env.js';
import { parseStoredSections, sectionsFor, type AdminSection } from '../../config/permissions.js';
import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { Role } from '../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateUserInput, PatchUserInput } from './user.schemas.js';

// Gestion des comptes par les administrateurs. Aucun e-mail n'est envoyé : le
// mot de passe temporaire est renvoyé une seule fois à l'administrateur, qui le
// transmet lui-même. Il n'est jamais enregistré en clair.

const userSelect = {
  id: true,
  email: true,
  role: true,
  actif: true,
  fullName: true,
  permissions: true,
  createdAt: true,
  startupProfile: { select: { nom: true } },
  mentorProfile: { select: { nomComplet: true } },
  investorProfile: { select: { organisation: true } },
  partnerProfile: { select: { organisation: true } },
} satisfies Prisma.UserSelect;

type UserRow = Prisma.UserGetPayload<{ select: typeof userSelect }>;

const isStaff = (role: Role) => role === 'ADMIN' || role === 'GESTIONNAIRE';

function displayName(user: UserRow): string {
  return (
    user.fullName ??
    user.startupProfile?.nom ??
    user.mentorProfile?.nomComplet ??
    user.investorProfile?.organisation ??
    user.partnerProfile?.organisation ??
    user.email
  );
}

function toDto(user: UserRow) {
  return {
    id: user.id,
    email: user.email,
    name: displayName(user),
    role: user.role,
    actif: user.actif,
    isStaff: isStaff(user.role),
    sections: sectionsFor(user.role, user.permissions),
    createdAt: user.createdAt,
  };
}

function generateTemporaryPassword(): string {
  // Le suffixe garantit une minuscule, une majuscule et un chiffre (règles du mot de passe).
  return `${randomBytes(12).toString('base64url')}aZ7`;
}

async function otherActiveAdmins(exceptId: string): Promise<number> {
  return prisma.user.count({ where: { role: 'ADMIN', actif: true, id: { not: exceptId } } });
}

export async function listUsers() {
  const rows = await prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
  const users = rows.map(toDto);
  return {
    users,
    stats: {
      total: users.length,
      actifs: users.filter((u) => u.actif).length,
      desactives: users.filter((u) => !u.actif).length,
      equipe: users.filter((u) => u.isStaff).length,
    },
  };
}

export async function createUser(input: CreateUserInput, actorId: string) {
  const exists = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
  if (exists) throw AppError.conflict('Un compte existe déjà avec cette adresse e-mail.');

  const temporaryPassword = input.password ? null : generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(input.password ?? temporaryPassword!, env.BCRYPT_ROUNDS);

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
        fullName: input.fullName,
        ...(input.role === 'GESTIONNAIRE' ? { permissions: input.sections } : {}),
      },
      select: userSelect,
    });
    await tx.auditLog.create({
      data: {
        userId: actorId,
        action: 'UTILISATEUR_CREE',
        entite: 'User',
        entiteId: user.id,
        meta: { role: user.role, sections: input.role === 'GESTIONNAIRE' ? input.sections : 'toutes' },
      },
    });
    return user;
  });

  return { user: toDto(created), temporaryPassword };
}

export async function patchUser(id: string, input: PatchUserInput, actorId: string) {
  const target = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!target) throw AppError.notFound('Utilisateur introuvable.');

  const touchesTeam = input.role !== undefined || input.sections !== undefined || input.fullName !== undefined;
  if (touchesTeam && !isStaff(target.role)) {
    throw AppError.badRequest("Seuls les comptes de l'équipe ont un rôle et des sections modifiables.");
  }

  if (id === actorId && (input.actif === false || (input.role !== undefined && input.role !== target.role))) {
    throw AppError.conflict('Vous ne pouvez pas désactiver votre propre compte ni changer votre propre rôle.');
  }

  const nextRole: Role = input.role ?? target.role;
  const losesAdmin =
    target.role === 'ADMIN' && target.actif && (input.actif === false || nextRole !== 'ADMIN');
  if (losesAdmin && (await otherActiveAdmins(id)) === 0) {
    throw AppError.conflict('Il doit rester au moins un administrateur actif.');
  }

  const data: Prisma.UserUpdateInput = {};
  if (input.fullName !== undefined) data.fullName = input.fullName;
  if (input.actif !== undefined) data.actif = input.actif;
  if (input.role !== undefined) data.role = input.role;

  if (isStaff(target.role) && (input.role !== undefined || input.sections !== undefined)) {
    const current = parseStoredSections(target.permissions) ?? sectionsFor('GESTIONNAIRE', null);
    const wanted = input.sections ?? current;
    if (nextRole === 'GESTIONNAIRE' && wanted.length === 0) {
      throw AppError.badRequest('Les données envoyées sont invalides.', {
        sections: ['Cochez au moins une section pour ce manager.'],
      });
    }
    data.permissions = nextRole === 'GESTIONNAIRE' ? wanted : Prisma.DbNull;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({ where: { id }, data, select: userSelect });
    if (input.actif === false) {
      await tx.refreshSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    await tx.auditLog.create({
      data: {
        userId: actorId,
        action: 'UTILISATEUR_MODIFIE',
        entite: 'User',
        entiteId: id,
        meta: { champs: Object.keys(input) },
      },
    });
    return user;
  });

  return toDto(updated);
}

export async function resetPassword(id: string, actorId: string) {
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!target) throw AppError.notFound('Utilisateur introuvable.');

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, env.BCRYPT_ROUNDS);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id }, data: { passwordHash } });
    // Toutes les sessions ouvertes de ce compte sont révoquées.
    await tx.refreshSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    await tx.auditLog.create({
      data: { userId: actorId, action: 'MOT_DE_PASSE_REINITIALISE', entite: 'User', entiteId: id },
    });
  });

  return { temporaryPassword };
}
