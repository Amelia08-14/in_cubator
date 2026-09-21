import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  bookMeetingSchema,
  meetingIdSchema,
  meetingListQuerySchema,
  patchMeetingSchema,
} from './meeting.schemas.js';
import {
  bookMentorSlot,
  type MeetingActor,
  listMeetings,
  patchMeeting,
} from './meeting.service.js';

function authenticatedActor(request: Request): MeetingActor {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return {
    userId: request.auth.userId,
    role: request.auth.role,
  };
}

export async function listMeetingsHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const query = meetingListQuerySchema.parse(request.query);
  const result = await listMeetings(authenticatedActor(request), query);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: result });
}

export async function bookMentorSlotHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = bookMeetingSchema.parse(request.body);
  const meeting = await bookMentorSlot(authenticatedActor(request), input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(201).json({ data: { meeting } });
}

export async function patchMeetingHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const meetingId = meetingIdSchema.parse(request.params.id);
  const input = patchMeetingSchema.parse(request.body);
  const meeting = await patchMeeting(authenticatedActor(request), meetingId, input);
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ data: { meeting } });
}
