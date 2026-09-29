import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import { cohortIdSchema, createCohortSchema, patchCohortSchema } from './cohort.schemas.js';
import { createCohort, getCohortOverview, listCohorts, patchCohort } from './cohort.service.js';

function actorId(request: Request): string {
  if (!request.auth) throw AppError.unauthorized();
  return request.auth.userId;
}

export async function listCohortsHandler(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: { cohorts: await listCohorts() } });
}

export async function createCohortHandler(request: Request, response: Response): Promise<void> {
  const cohort = await createCohort(createCohortSchema.parse(request.body), actorId(request));
  response.status(201).json({ data: { cohort } });
}

export async function patchCohortHandler(request: Request, response: Response): Promise<void> {
  const { id } = cohortIdSchema.parse(request.params);
  const cohort = await patchCohort(id, patchCohortSchema.parse(request.body), actorId(request));
  response.status(200).json({ data: { cohort } });
}

export async function cohortOverviewHandler(request: Request, response: Response): Promise<void> {
  const { id } = cohortIdSchema.parse(request.params);
  response.status(200).json({ data: await getCohortOverview(id) });
}
