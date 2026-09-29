import type { Request, Response } from 'express';

import { clearAuthCookies, setAuthCookies } from '../../config/cookies.js';
import { cookieNamesFor, realmOfRequest, type AuthRealm } from '../../config/realm.js';
import { AppError } from '../../errors/app-error.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import {
  getCurrentUser,
  getCurrentSessionUser,
  login,
  refreshSession,
  register,
  revokeAllSessions,
  revokeSession,
  type SessionMetadata,
} from './auth.service.js';

function getSessionMetadata(request: Request): SessionMetadata {
  return {
    ipAddress: request.ip,
    userAgent: request.get('user-agent'),
  };
}

function readRefreshCookie(request: Request, realm: AuthRealm): string | undefined {
  const cookies = request.cookies as Record<string, unknown> | undefined;
  const value = cookies?.[cookieNamesFor(realm).refresh];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export async function registerHandler(request: Request, response: Response): Promise<void> {
  const result = await register(registerSchema.parse(request.body), getSessionMetadata(request));
  setAuthCookies(response, result, 'member');
  response.status(201).json({ data: { user: result.user } });
}

export async function loginHandler(request: Request, response: Response): Promise<void> {
  const result = await login(loginSchema.parse(request.body), getSessionMetadata(request), 'member');
  setAuthCookies(response, result, 'member');
  response.status(200).json({ data: { user: result.user } });
}

// Connexion de l'équipe : route dédiée, jamais déduite d'un en-tête.
export async function adminLoginHandler(request: Request, response: Response): Promise<void> {
  const result = await login(loginSchema.parse(request.body), getSessionMetadata(request), 'admin');
  setAuthCookies(response, result, 'admin');
  response.status(200).json({ data: { user: result.user } });
}

export async function refreshHandler(request: Request, response: Response): Promise<void> {
  const realm = realmOfRequest(request);
  const refreshToken = readRefreshCookie(request, realm);
  if (!refreshToken) {
    throw AppError.unauthorized('Session de renouvellement absente.');
  }

  const result = await refreshSession(refreshToken, getSessionMetadata(request), realm);
  setAuthCookies(response, result, realm);
  response.status(200).json({ data: { user: result.user } });
}

export async function sessionHandler(request: Request, response: Response): Promise<void> {
  const realm = realmOfRequest(request);
  const refreshToken = readRefreshCookie(request, realm);
  if (!refreshToken) {
    throw AppError.unauthorized('Session absente.');
  }

  const user = await getCurrentSessionUser(refreshToken, realm);
  response.status(200).json({ data: { user } });
}

export async function logoutHandler(request: Request, response: Response): Promise<void> {
  const realm = realmOfRequest(request);
  await revokeSession(readRefreshCookie(request, realm));
  clearAuthCookies(response, realm);
  response.status(204).send();
}

export async function logoutAllHandler(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  await revokeAllSessions(request.auth.userId);
  clearAuthCookies(response, realmOfRequest(request));
  response.status(204).send();
}

export async function meHandler(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  const user = await getCurrentUser(request.auth.userId);
  response.status(200).json({ data: { user } });
}
