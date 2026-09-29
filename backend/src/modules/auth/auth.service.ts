import { randomUUID } from 'node:crypto';

import bcrypt from 'bcryptjs';

import { env } from '../../config/env.js';
import { roleBelongsToRealm, type AuthRealm } from '../../config/realm.js';
import { AppError } from '../../errors/app-error.js';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  tokenHashesMatch,
  verifyRefreshToken,
} from './auth.tokens.js';

const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  actif: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const loginUserSelect = {
  ...publicUserSelect,
  passwordHash: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

export interface SessionMetadata {
  ipAddress: string | undefined;
  userAgent: string | undefined;
}

export interface AuthSession {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

function sanitizeMetadata(metadata: SessionMetadata): SessionMetadata {
  return {
    ipAddress: metadata.ipAddress?.slice(0, 45),
    userAgent: metadata.userAgent?.slice(0, 512),
  };
}

function prepareSession(user: PublicUser, metadata: SessionMetadata, familyId?: string) {
  const tokens = newSessionTokens(user);
  const safeMetadata = sanitizeMetadata(metadata);

  return {
    tokens,
    data: {
      id: tokens.sessionId,
      userId: user.id,
      familyId: familyId ?? tokens.sessionId,
      tokenHash: tokens.refreshTokenHash,
      expiresAt: tokens.expiresAt,
      ...(safeMetadata.ipAddress ? { ipAddress: safeMetadata.ipAddress } : {}),
      ...(safeMetadata.userAgent ? { userAgent: safeMetadata.userAgent } : {}),
    },
  };
}

function newSessionTokens(user: PublicUser): {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  expiresAt: Date;
} {
  const sessionId = randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user.id, sessionId);

  return {
    sessionId,
    accessToken,
    refreshToken,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1_000),
  };
}

async function createSession(user: PublicUser, metadata: SessionMetadata): Promise<AuthSession> {
  const { tokens, data } = prepareSession(user, metadata);

  await prisma.refreshSession.create({
    data,
  });

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function register(input: RegisterInput, metadata: SessionMetadata): Promise<AuthSession> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw AppError.conflict('Un compte existe déjà avec cette adresse e-mail.');
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
      },
      select: publicUserSelect,
    });
    const { tokens, data } = prepareSession(user, metadata);

    await transaction.refreshSession.create({ data });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  });
}

export async function login(
  input: LoginInput,
  metadata: SessionMetadata,
  realm: AuthRealm = 'member',
): Promise<AuthSession> {
  const userWithPassword = await prisma.user.findUnique({
    where: { email: input.email },
    select: loginUserSelect,
  });

  if (!userWithPassword || !userWithPassword.actif) {
    throw AppError.unauthorized('Adresse e-mail ou mot de passe incorrect.');
  }

  const passwordMatches = await bcrypt.compare(input.password, userWithPassword.passwordHash);
  if (!passwordMatches) {
    throw AppError.unauthorized('Adresse e-mail ou mot de passe incorrect.');
  }

  const { passwordHash: _passwordHash, ...user } = userWithPassword;

  if (!roleBelongsToRealm(user.role, realm)) {
    // Connexion membre avec un compte d'équipe : on l'indique clairement.
    // Connexion administration avec un compte membre : message générique, pour
    // ne pas révéler que le compte existe.
    throw realm === 'member'
      ? AppError.forbidden("Ce compte est réservé à l'administration. Utilisez la connexion administrateur.")
      : AppError.unauthorized('Adresse e-mail ou mot de passe incorrect.');
  }

  return createSession(user, metadata);
}

async function validateRefreshSession(presentedToken: string) {
  const claims = verifyRefreshToken(presentedToken);
  const presentedHash = hashRefreshToken(presentedToken);
  const currentSession = await prisma.refreshSession.findUnique({
    where: { id: claims.sessionId },
    select: {
      id: true,
      userId: true,
      familyId: true,
      tokenHash: true,
      expiresAt: true,
      revokedAt: true,
      user: { select: publicUserSelect },
    },
  });

  if (
    currentSession?.revokedAt &&
    currentSession.userId === claims.userId &&
    tokenHashesMatch(currentSession.tokenHash, presentedHash)
  ) {
    await prisma.refreshSession.updateMany({
      where: { familyId: currentSession.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw AppError.unauthorized('Reutilisation de session detectee. Connexion revoquee.');
  }

  if (
    !currentSession ||
    currentSession.userId !== claims.userId ||
    currentSession.revokedAt ||
    currentSession.expiresAt <= new Date() ||
    !currentSession.user.actif ||
    !tokenHashesMatch(currentSession.tokenHash, presentedHash)
  ) {
    throw AppError.unauthorized('Session de renouvellement invalide ou expirée.');
  }

  return { currentSession, presentedHash };
}

export async function getCurrentSessionUser(
  presentedToken: string,
  realm: AuthRealm = 'member',
): Promise<PublicUser> {
  const { user } = (await validateRefreshSession(presentedToken)).currentSession;
  if (!roleBelongsToRealm(user.role, realm)) {
    throw AppError.unauthorized('Session invalide pour cet espace.');
  }
  return user;
}

export async function refreshSession(
  presentedToken: string,
  metadata: SessionMetadata,
  realm: AuthRealm = 'member',
): Promise<AuthSession> {
  const { currentSession, presentedHash } = await validateRefreshSession(presentedToken);

  if (!roleBelongsToRealm(currentSession.user.role, realm)) {
    throw AppError.unauthorized('Session invalide pour cet espace.');
  }

  const nextTokens = newSessionTokens(currentSession.user);
  const safeMetadata = sanitizeMetadata(metadata);
  const revokedAt = new Date();

  try {
    await prisma.$transaction(async (transaction) => {
      const revoked = await transaction.refreshSession.updateMany({
        where: {
          id: currentSession.id,
          tokenHash: presentedHash,
          revokedAt: null,
          expiresAt: { gt: revokedAt },
        },
        data: { revokedAt, replacedById: nextTokens.sessionId },
      });

      if (revoked.count !== 1) {
      throw AppError.unauthorized('Cette session a déjà été renouvelée.');
      }

      await transaction.refreshSession.create({
        data: {
          id: nextTokens.sessionId,
          userId: currentSession.user.id,
          familyId: currentSession.familyId,
          tokenHash: nextTokens.refreshTokenHash,
          expiresAt: nextTokens.expiresAt,
          ...(safeMetadata.ipAddress ? { ipAddress: safeMetadata.ipAddress } : {}),
          ...(safeMetadata.userAgent ? { userAgent: safeMetadata.userAgent } : {}),
        },
      });
    });
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 401) {
      await prisma.refreshSession.updateMany({
        where: { familyId: currentSession.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    throw error;
  }

  return {
    user: currentSession.user,
    accessToken: nextTokens.accessToken,
    refreshToken: nextTokens.refreshToken,
  };
}

export async function revokeSession(presentedToken: string | undefined): Promise<void> {
  if (!presentedToken) return;

  await prisma.refreshSession.updateMany({
    where: {
      tokenHash: hashRefreshToken(presentedToken),
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.refreshSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user || !user.actif) {
    throw AppError.unauthorized('Compte introuvable ou désactivé.');
  }

  return user;
}
