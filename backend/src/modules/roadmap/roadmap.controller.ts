import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  createObjectiveSchema,
  createObjectiveTaskSchema,
  createTaskSchema,
  patchObjectiveSchema,
  patchTaskSchema,
  roadmapIdSchema,
} from './roadmap.schemas.js';
import {
  createObjective,
  createTask,
  deleteObjective,
  deleteTask,
  getRoadmap,
  patchObjective,
  patchTask,
  type RoadmapActor,
} from './roadmap.service.js';

function authenticatedActor(request: Request): RoadmapActor {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return {
    userId: request.auth.userId,
    role: request.auth.role,
  };
}

function startupId(request: Request): string {
  return roadmapIdSchema.parse(request.params.startupId);
}

export async function getRoadmapHandler(request: Request, response: Response): Promise<void> {
  const roadmap = await getRoadmap(startupId(request), authenticatedActor(request));
  response.status(200).json({ data: roadmap });
}

export async function createObjectiveHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createObjectiveSchema.parse(request.body);
  const objective = await createObjective(startupId(request), authenticatedActor(request), input);
  response.status(201).json({ data: { objective } });
}

export async function patchObjectiveHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const objectiveId = roadmapIdSchema.parse(request.params.objectiveId);
  const input = patchObjectiveSchema.parse(request.body);
  const objective = await patchObjective(
    startupId(request),
    objectiveId,
    authenticatedActor(request),
    input,
  );
  response.status(200).json({ data: { objective } });
}

export async function deleteObjectiveHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const objectiveId = roadmapIdSchema.parse(request.params.objectiveId);
  await deleteObjective(startupId(request), objectiveId, authenticatedActor(request));
  response.status(204).send();
}

export async function createTaskHandler(request: Request, response: Response): Promise<void> {
  const input = createTaskSchema.parse(request.body);
  const task = await createTask(startupId(request), authenticatedActor(request), input);
  response.status(201).json({ data: { task } });
}

export async function createObjectiveTaskHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const objectiveId = roadmapIdSchema.parse(request.params.objectiveId);
  const body = createObjectiveTaskSchema.parse(request.body);
  const task = await createTask(startupId(request), authenticatedActor(request), {
    ...body,
    objectifId: objectiveId,
  });
  response.status(201).json({ data: { task } });
}

export async function patchTaskHandler(request: Request, response: Response): Promise<void> {
  const taskId = roadmapIdSchema.parse(request.params.taskId);
  const input = patchTaskSchema.parse(request.body);
  const task = await patchTask(
    startupId(request),
    taskId,
    authenticatedActor(request),
    input,
  );
  response.status(200).json({ data: { task } });
}

export async function deleteTaskHandler(request: Request, response: Response): Promise<void> {
  const taskId = roadmapIdSchema.parse(request.params.taskId);
  await deleteTask(startupId(request), taskId, authenticatedActor(request));
  response.status(204).send();
}
