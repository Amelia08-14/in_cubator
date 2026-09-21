import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import { putInvestorPreferencesSchema } from './investor.schemas.js';
import { getOwnInvestorPreferences, putOwnInvestorPreferences } from './investor.service.js';

function authenticatedUserId(request: Request): string {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return request.auth.userId;
}

export async function getOwnInvestorPreferencesHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const preferences = await getOwnInvestorPreferences(authenticatedUserId(request));
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { preferences } });
}

export async function putOwnInvestorPreferencesHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = putInvestorPreferencesSchema.parse(request.body);
  const preferences = await putOwnInvestorPreferences(authenticatedUserId(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { preferences } });
}
