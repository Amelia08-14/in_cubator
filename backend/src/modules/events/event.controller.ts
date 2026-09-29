import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  createEventSchema,
  eventIdSchema,
  eventSlugSchema,
  patchEventSchema,
  patchRegistrationSchema,
  publicEventsQuerySchema,
  registerSchema,
  registrationParamsSchema,
} from './event.schemas.js';
import {
  createEvent,
  deleteEvent,
  getPublicEvent,
  listAdminEvents,
  listPublicEvents,
  listRegistrations,
  patchEvent,
  patchRegistration,
  registerToEvent,
} from './event.service.js';

function actorId(request: Request): string {
  if (!request.auth) throw AppError.unauthorized();
  return request.auth.userId;
}

export async function listPublicEventsHandler(request: Request, response: Response): Promise<void> {
  const events = await listPublicEvents(publicEventsQuerySchema.parse(request.query));
  response.status(200).json({ data: { events } });
}

export async function getPublicEventHandler(request: Request, response: Response): Promise<void> {
  const { slug } = eventSlugSchema.parse(request.params);
  response.status(200).json({ data: { event: await getPublicEvent(slug) } });
}

export async function registerHandler(request: Request, response: Response): Promise<void> {
  const { slug } = eventSlugSchema.parse(request.params);
  const result = await registerToEvent(slug, registerSchema.parse(request.body));
  response.status(201).json({ data: result });
}

export async function listAdminEventsHandler(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: { events: await listAdminEvents() } });
}

export async function createEventHandler(request: Request, response: Response): Promise<void> {
  const event = await createEvent(createEventSchema.parse(request.body), actorId(request));
  response.status(201).json({ data: { event } });
}

export async function patchEventHandler(request: Request, response: Response): Promise<void> {
  const { id } = eventIdSchema.parse(request.params);
  const event = await patchEvent(id, patchEventSchema.parse(request.body), actorId(request));
  response.status(200).json({ data: { event } });
}

export async function deleteEventHandler(request: Request, response: Response): Promise<void> {
  const { id } = eventIdSchema.parse(request.params);
  await deleteEvent(id, actorId(request));
  response.status(204).end();
}

export async function listRegistrationsHandler(request: Request, response: Response): Promise<void> {
  const { id } = eventIdSchema.parse(request.params);
  response.status(200).json({ data: { registrations: await listRegistrations(id) } });
}

export async function patchRegistrationHandler(request: Request, response: Response): Promise<void> {
  const { id, registrationId } = registrationParamsSchema.parse(request.params);
  const { status } = patchRegistrationSchema.parse(request.body);
  const registration = await patchRegistration(id, registrationId, status, actorId(request));
  response.status(200).json({ data: { registration } });
}
