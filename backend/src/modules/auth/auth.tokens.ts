import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';

import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';
import { Role } from '../../generated/prisma/enums.js';

export interface AccessTokenUser {
  id: string;
  email: string;
  role: Role;
}

export interface VerifiedAccessToken {
  userId: string;
  email: string;
  role: Role;
}

export interface VerifiedRefreshToken {
  userId: string;
  sessionId: string;
}

function verifyJwt(token: string, secret: string): JwtPayload {
  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    if (typeof payload === 'string') {
      throw AppError.unauthorized('Jeton invalide.');
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Jeton expiré.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Jeton invalide.');
    }
    throw error;
  }
}

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && Object.values(Role).includes(value as Role);
}

export function signAccessToken(user: AccessTokenUser): string {
  return jwt.sign(
    {
      type: 'access',
      email: user.email,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    {
      algorithm: 'HS256',
      audience: env.JWT_AUDIENCE,
      expiresIn: env.JWT_ACCESS_TTL_SECONDS,
      issuer: env.JWT_ISSUER,
      jwtid: randomUUID(),
      subject: user.id,
    },
  );
}

export function signRefreshToken(userId: string, sessionId: string): string {
  return jwt.sign(
    { type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    {
      algorithm: 'HS256',
      audience: env.JWT_AUDIENCE,
      expiresIn: env.JWT_REFRESH_TTL_SECONDS,
      issuer: env.JWT_ISSUER,
      jwtid: sessionId,
      subject: userId,
    },
  );
}

export function verifyAccessToken(token: string): VerifiedAccessToken {
  const payload = verifyJwt(token, env.JWT_ACCESS_SECRET);

  if (
    payload.type !== 'access' ||
    typeof payload.sub !== 'string' ||
    typeof payload.email !== 'string' ||
    !isRole(payload.role)
  ) {
    throw AppError.unauthorized('Jeton d’accès invalide.');
  }

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

export function verifyRefreshToken(token: string): VerifiedRefreshToken {
  const payload = verifyJwt(token, env.JWT_REFRESH_SECRET);

  if (
    payload.type !== 'refresh' ||
    typeof payload.sub !== 'string' ||
    typeof payload.jti !== 'string'
  ) {
    throw AppError.unauthorized('Jeton de renouvellement invalide.');
  }

  return { userId: payload.sub, sessionId: payload.jti };
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function tokenHashesMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
