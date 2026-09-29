import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  activityIdSchema,
  createActivitySchema,
  createLeadSchema,
  leadIdSchema,
  leadListQuerySchema,
  loseLeadSchema,
  patchLeadSchema,
  publicLeadSchema,
} from './crm.schemas.js';
import {
  addActivity,
  completeActivity,
  createLead,
  createPublicLead,
  deleteActivity,
  deleteLead,
  getLead,
  getStats,
  listLeads,
  listStaff,
  markLeadLost,
  markLeadWon,
  patchLead,
  reopenLead,
} from './crm.service.js';

function actorId(request: Request): string {
  if (!request.auth) throw AppError.unauthorized();
  return request.auth.userId;
}

function idParam(request: Request): string {
  return leadIdSchema.parse(request.params).id;
}

export async function createPublicLeadHandler(request: Request, response: Response): Promise<void> {
  const input = publicLeadSchema.parse(request.body);
  const result = await createPublicLead(input);
  response.status(201).json({ data: result });
}

export async function listLeadsHandler(request: Request, response: Response): Promise<void> {
  const leads = await listLeads(leadListQuerySchema.parse(request.query));
  response.status(200).json({ data: { leads } });
}

export async function getLeadHandler(request: Request, response: Response): Promise<void> {
  const lead = await getLead(idParam(request));
  response.status(200).json({ data: { lead } });
}

export async function createLeadHandler(request: Request, response: Response): Promise<void> {
  const lead = await createLead(createLeadSchema.parse(request.body), actorId(request));
  response.status(201).json({ data: { lead } });
}

export async function patchLeadHandler(request: Request, response: Response): Promise<void> {
  const lead = await patchLead(idParam(request), patchLeadSchema.parse(request.body), actorId(request));
  response.status(200).json({ data: { lead } });
}

export async function winLeadHandler(request: Request, response: Response): Promise<void> {
  const lead = await markLeadWon(idParam(request), actorId(request));
  response.status(200).json({ data: { lead } });
}

export async function loseLeadHandler(request: Request, response: Response): Promise<void> {
  const { reason } = loseLeadSchema.parse(request.body);
  const lead = await markLeadLost(idParam(request), reason, actorId(request));
  response.status(200).json({ data: { lead } });
}

export async function reopenLeadHandler(request: Request, response: Response): Promise<void> {
  const lead = await reopenLead(idParam(request), actorId(request));
  response.status(200).json({ data: { lead } });
}

export async function deleteLeadHandler(request: Request, response: Response): Promise<void> {
  await deleteLead(idParam(request));
  response.status(204).end();
}

export async function addActivityHandler(request: Request, response: Response): Promise<void> {
  const activity = await addActivity(
    idParam(request),
    createActivitySchema.parse(request.body),
    actorId(request),
  );
  response.status(201).json({ data: { activity } });
}

export async function completeActivityHandler(request: Request, response: Response): Promise<void> {
  const activity = await completeActivity(activityIdSchema.parse(request.params).id);
  response.status(200).json({ data: { activity } });
}

export async function deleteActivityHandler(request: Request, response: Response): Promise<void> {
  await deleteActivity(activityIdSchema.parse(request.params).id);
  response.status(204).end();
}

export async function statsHandler(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: await getStats() });
}

export async function staffHandler(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: { staff: await listStaff() } });
}
