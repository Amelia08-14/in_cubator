import type { RequestHandler } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import type { Role } from '../generated/prisma/enums.js';
import { prisma } from '../lib/prisma.js';
import { verifyAccessToken } from '../modules/auth/auth.tokens.js';

function readCookie(request: Parameters<RequestHandler>[0], name: string): string | undefined {
  const cookies = request.cookies as Record<string, unknown> | undefined;
  const value = cookies?.[name];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const token = readCookie(request, env.ACCESS_COOKIE_NAME);
    if (!token) {
      throw AppError.unauthorized();
    }

    const claims = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: claims.userId },
      select: { id: true, email: true, role: true, actif: true },
    });

    if (!user?.actif) {
      throw AppError.unauthorized('Compte introuvable ou desactive.');
    }

    request.auth = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export function requireRoles(...roles: readonly Role[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(AppError.unauthorized());
      return;
    }

    if (!roles.includes(request.auth.role)) {
      next(AppError.forbidden());
      return;
    }

    next();
  };
}
