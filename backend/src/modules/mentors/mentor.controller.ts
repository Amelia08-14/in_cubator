import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  adminMentorListQuerySchema,
  createDisponibiliteSchema,
  createMentorSchema,
  disponibiliteIdSchema,
  mentorActivationSchema,
  mentorIdSchema,
  mentorListQuerySchema,
  patchMentorProfileSchema,
  putMentorProfileSchema,
} from './mentor.schemas.js';
import {
  createMentorForAdmin,
  createOwnDisponibilite,
  deleteOwnDisponibilite,
  getOwnMentorProfile,
  listMentorsForAdmin,
  listPublicMentors,
  patchOwnMentorProfile,
  putOwnMentorProfile,
  setMentorActivation,
} from './mentor.service.js';

function authenticatedUserId(request: Request): string {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return request.auth.userId;
}

export async function listPublicMentorsHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const query = mentorListQuerySchema.parse(request.query);
  const result = await listPublicMentors(query);
  response.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  response.status(200).json({ data: result });
}

export async function getOwnMentorProfileHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const mentor = await getOwnMentorProfile(authenticatedUserId(request));
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { mentor } });
}

export async function putOwnMentorProfileHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = putMentorProfileSchema.parse(request.body);
  const mentor = await putOwnMentorProfile(authenticatedUserId(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { mentor } });
}

export async function patchOwnMentorProfileHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = patchMentorProfileSchema.parse(request.body);
  const mentor = await patchOwnMentorProfile(authenticatedUserId(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { mentor } });
}

export async function listMentorsForAdminHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const query = adminMentorListQuerySchema.parse(request.query);
  const result = await listMentorsForAdmin(query);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: result });
}

export async function createOwnDisponibiliteHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createDisponibiliteSchema.parse(request.body);
  const disponibilite = await createOwnDisponibilite(authenticatedUserId(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(201).json({ data: { disponibilite } });
}

export async function deleteOwnDisponibiliteHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const disponibiliteId = disponibiliteIdSchema.parse(request.params.id);
  await deleteOwnDisponibilite(authenticatedUserId(request), disponibiliteId);
  response.setHeader('Cache-Control', 'no-store');
  response.status(204).send();
}

export async function createMentorHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createMentorSchema.parse(request.body);
  const mentor = await createMentorForAdmin(input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(201).json({ data: { mentor } });
}

export async function setMentorActivationHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const mentorId = mentorIdSchema.parse(request.params.id);
  const { actif } = mentorActivationSchema.parse(request.body);
  const mentor = await setMentorActivation(mentorId, actif, authenticatedUserId(request));
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { mentor } });
}
