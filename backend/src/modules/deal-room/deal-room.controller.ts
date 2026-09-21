import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import {
  accessRequestDecisionSchema,
  accessRequestListQuerySchema,
  accessRequestParamsSchema,
  createAccessRequestSchema,
  createDealRoomDocumentSchema,
  dealRoomDocumentIdParamsSchema,
  dealRoomDocumentListQuerySchema,
  dealRoomDocumentParamsSchema,
  patchDealRoomDocumentSchema,
} from './deal-room.schemas.js';
import {
  createAccessRequest,
  createDealRoomDocument,
  decideAccessRequest,
  type DealRoomActor,
  listAccessRequests,
  listDealRoomDocuments,
  patchDealRoomDocument,
} from './deal-room.service.js';

function authenticatedActor(request: Request): DealRoomActor {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  return {
    userId: request.auth.userId,
    role: request.auth.role,
  };
}

function disableCache(response: Response): void {
  response.setHeader('Cache-Control', 'no-store');
}

export async function createAccessRequestHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createAccessRequestSchema.parse(request.body);
  const accessRequest = await createAccessRequest(authenticatedActor(request), input);
  disableCache(response);
  response.status(201).json({ data: { accessRequest } });
}

export async function listAccessRequestsHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const query = accessRequestListQuerySchema.parse(request.query);
  const result = await listAccessRequests(authenticatedActor(request), query);
  disableCache(response);
  response.status(200).json({ data: result });
}

export async function decideAccessRequestHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const { id } = accessRequestParamsSchema.parse(request.params);
  const input = accessRequestDecisionSchema.parse(request.body);
  const accessRequest = await decideAccessRequest(authenticatedActor(request), id, input);
  disableCache(response);
  response.status(200).json({ data: { accessRequest } });
}

export async function listDealRoomDocumentsHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const { startupId } = dealRoomDocumentParamsSchema.parse(request.params);
  const query = dealRoomDocumentListQuerySchema.parse(request.query);
  const result = await listDealRoomDocuments(authenticatedActor(request), startupId, query);
  disableCache(response);
  response.status(200).json({ data: result });
}

export async function createDealRoomDocumentHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const { startupId } = dealRoomDocumentParamsSchema.parse(request.params);
  const input = createDealRoomDocumentSchema.parse(request.body);
  const document = await createDealRoomDocument(authenticatedActor(request), startupId, input);
  disableCache(response);
  response.status(201).json({ data: { document } });
}

export async function patchDealRoomDocumentHandler(
  request: Request,
  response: Response,
): Promise<void> {
  const { startupId, documentId } = dealRoomDocumentIdParamsSchema.parse(request.params);
  const input = patchDealRoomDocumentSchema.parse(request.body);
  const document = await patchDealRoomDocument(
    authenticatedActor(request),
    startupId,
    documentId,
    input,
  );
  disableCache(response);
  response.status(200).json({ data: { document } });
}
