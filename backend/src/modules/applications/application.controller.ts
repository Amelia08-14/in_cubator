import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  adminApplicationListQuerySchema,
  applicationDecisionSchema,
  applicationIdSchema,
  createApplicationSchema,
  patchOwnApplicationSchema,
} from './application.schemas.js';
import {
  createOwnApplication,
  decideApplication,
  getApplicationForAdmin,
  getOwnApplication,
  listApplicationsForAdmin,
  patchOwnApplication,
} from './application.service.js';

function authenticatedUserId(request: Request): string {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return request.auth.userId;
}

export async function createOwnApplicationHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createApplicationSchema.parse(request.body);
  const application = await createOwnApplication(authenticatedUserId(request), input);
  response.status(201).json({ data: { application } });
}

export async function getOwnApplicationHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const application = await getOwnApplication(authenticatedUserId(request));
  response.status(200).json({ data: { application } });
}

export async function patchOwnApplicationHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = patchOwnApplicationSchema.parse(request.body);
  const application = await patchOwnApplication(authenticatedUserId(request), input);
  response.status(200).json({ data: { application } });
}

export async function listApplicationsForAdminHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const query = adminApplicationListQuerySchema.parse(request.query);
  const result = await listApplicationsForAdmin(query);
  response.status(200).json({ data: result });
}

export async function getApplicationForAdminHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const applicationId = applicationIdSchema.parse(request.params.id);
  const application = await getApplicationForAdmin(applicationId);
  response.status(200).json({ data: { application } });
}

export async function decideApplicationHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const applicationId = applicationIdSchema.parse(request.params.id);
  const input = applicationDecisionSchema.parse(request.body);
  const application = await decideApplication(
    applicationId,
    authenticatedUserId(request),
    input,
  );
  response.status(200).json({ data: { application } });
}
