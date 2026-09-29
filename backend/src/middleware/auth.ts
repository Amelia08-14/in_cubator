import type { RequestHandler } from 'express';

import { sectionsFor, type AdminSection } from '../config/permissions.js';
import { cookieNamesFor, realmOfRequest, roleBelongsToRealm } from '../config/realm.js';
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
    const realm = realmOfRequest(request);
    const token = readCookie(request, cookieNamesFor(realm).access);
    if (!token) {
      throw AppError.unauthorized();
    }

    const claims = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: claims.userId },
      select: { id: true, email: true, role: true, actif: true, permissions: true },
    });

    if (!user?.actif) {
      throw AppError.unauthorized('Compte introuvable ou desactive.');
    }

    // Un jeton ne franchit jamais la frontière membre / administration.
    if (!roleBelongsToRealm(user.role, realm)) {
      throw AppError.forbidden('Ce compte ne peut pas utiliser cet espace.');
    }

    request.auth = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sections: sectionsFor(user.role, user.permissions),
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

/**
 * Réserve une route à l'équipe qui a reçu cette section : un administrateur y
 * accède toujours, un manager seulement si l'administrateur la lui a accordée.
 */
export function requireSection(section: AdminSection): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(AppError.unauthorized());
      return;
    }

    const { role, sections } = request.auth;
    if ((role !== 'ADMIN' && role !== 'GESTIONNAIRE') || !sections.includes(section)) {
      next(AppError.forbidden("Vous n'avez pas accès à cette section."));
      return;
    }

    next();
  };
}

/**
 * Pour les routes partagées avec les membres : seul le personnel est soumis à
 * la section ; les autres rôles restent gérés par `requireRoles`.
 */
export function requireSectionForStaff(section: AdminSection): RequestHandler {
  return (request, _response, next) => {
    if (request.auth && (request.auth.role === 'ADMIN' || request.auth.role === 'GESTIONNAIRE')) {
      requireSection(section)(request, _response, next);
      return;
    }
    next();
  };
}
