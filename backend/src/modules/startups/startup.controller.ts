import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  patchStartupProfileSchema,
  putStartupProfileSchema,
  startupIdSchema,
  startupListQuerySchema,
} from './startup.schemas.js';
import {
  getOwnStartupProfile,
  getPublicStartup,
  listPublicStartups,
  patchOwnStartupProfile,
  putOwnStartupProfile,
} from './startup.service.js';

function authenticatedUserId(request: Request): string {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return request.auth.userId;
}

function setPublicCache(response: Response): void {
  response.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
}

export async function listPublicStartupsHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const query = startupListQuerySchema.parse(request.query);
  const result = await listPublicStartups(query);
  setPublicCache(response);
  response.status(200).json({ data: result });
}

export async function getPublicStartupHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const startupId = startupIdSchema.parse(request.params.id);
  const startup = await getPublicStartup(startupId);
  setPublicCache(response);
  response.status(200).json({ data: { startup } });
}

export async function getOwnStartupProfileHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const startup = await getOwnStartupProfile(authenticatedUserId(request));
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { startup } });
}

export async function putOwnStartupProfileHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = putStartupProfileSchema.parse(request.body);
  const startup = await putOwnStartupProfile(authenticatedUserId(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { startup } });
}

export async function patchOwnStartupProfileHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = patchStartupProfileSchema.parse(request.body);
  const startup = await patchOwnStartupProfile(authenticatedUserId(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { startup } });
}
