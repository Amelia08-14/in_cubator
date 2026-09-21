import type { Request, Response } from 'express';

import { clearAuthCookies, setAuthCookies } from '../../config/cookies.js';
import { env } from '../../config/env.js';
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

function readRefreshCookie(request: Request): string | undefined {
  const cookies = request.cookies as Record<string, unknown> | undefined;
  const value = cookies?.[env.REFRESH_COOKIE_NAME];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export async function registerHandler(request: Request, response: Response): Promise<void> {
  const result = await register(registerSchema.parse(request.body), getSessionMetadata(request));
  setAuthCookies(response, result);
  response.status(201).json({ data: { user: result.user } });
}

export async function loginHandler(request: Request, response: Response): Promise<void> {
  const result = await login(loginSchema.parse(request.body), getSessionMetadata(request));
  setAuthCookies(response, result);
  response.status(200).json({ data: { user: result.user } });
}

export async function refreshHandler(request: Request, response: Response): Promise<void> {
  const refreshToken = readRefreshCookie(request);
  if (!refreshToken) {
    throw AppError.unauthorized('Session de renouvellement absente.');
  }

  const result = await refreshSession(refreshToken, getSessionMetadata(request));
  setAuthCookies(response, result);
  response.status(200).json({ data: { user: result.user } });
}

export async function sessionHandler(request: Request, response: Response): Promise<void> {
  const refreshToken = readRefreshCookie(request);
  if (!refreshToken) {
    throw AppError.unauthorized('Session absente.');
  }

  const user = await getCurrentSessionUser(refreshToken);
  response.status(200).json({ data: { user } });
}

export async function logoutHandler(request: Request, response: Response): Promise<void> {
  await revokeSession(readRefreshCookie(request));
  clearAuthCookies(response);
  response.status(204).send();
}

export async function logoutAllHandler(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  await revokeAllSessions(request.auth.userId);
  clearAuthCookies(response);
  response.status(204).send();
}

export async function meHandler(request: Request, response: Response): Promise<void> {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  const user = await getCurrentUser(request.auth.userId);
  response.status(200).json({ data: { user } });
}
