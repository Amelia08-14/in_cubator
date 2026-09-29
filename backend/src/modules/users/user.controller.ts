import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import { createUserSchema, patchUserSchema, userIdSchema } from './user.schemas.js';
import { createUser, listUsers, patchUser, resetPassword } from './user.service.js';

function actorId(request: Request): string {
  if (!request.auth) throw AppError.unauthorized();
  return request.auth.userId;
}

export async function listUsersHandler(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: await listUsers() });
}

export async function createUserHandler(request: Request, response: Response): Promise<void> {
  const result = await createUser(createUserSchema.parse(request.body), actorId(request));
  response.status(201).json({ data: result });
}

export async function patchUserHandler(request: Request, response: Response): Promise<void> {
  const { id } = userIdSchema.parse(request.params);
  const user = await patchUser(id, patchUserSchema.parse(request.body), actorId(request));
  response.status(200).json({ data: { user } });
}

export async function resetPasswordHandler(request: Request, response: Response): Promise<void> {
  const { id } = userIdSchema.parse(request.params);
  response.status(200).json({ data: await resetPassword(id, actorId(request)) });
}
