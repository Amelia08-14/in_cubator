import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  createAccessRequestHandler,
  createDealRoomDocumentHandler,
  decideAccessRequestHandler,
  listAccessRequestsHandler,
  listDealRoomDocumentsHandler,
  patchDealRoomDocumentHandler,
} from './deal-room.controller.js';

export const dealRoomRouter = Router();

dealRoomRouter.use(requireAuth);

dealRoomRouter.get(
  '/access-requests',
  requireRoles('PORTEUR_STARTUP', 'INVESTISSEUR', 'GESTIONNAIRE', 'ADMIN'),
  listAccessRequestsHandler,
);
dealRoomRouter.post(
  '/access-requests',
  requireRoles('INVESTISSEUR'),
  createAccessRequestHandler,
);
dealRoomRouter.patch(
  '/access-requests/:id/decision',
  requireRoles('PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN'),
  decideAccessRequestHandler,
);
dealRoomRouter.get(
  '/startups/:startupId/documents',
  requireRoles('PORTEUR_STARTUP', 'INVESTISSEUR', 'GESTIONNAIRE', 'ADMIN'),
  listDealRoomDocumentsHandler,
);
dealRoomRouter.post(
  '/startups/:startupId/documents',
  requireRoles('PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN'),
  createDealRoomDocumentHandler,
);
dealRoomRouter.patch(
  '/startups/:startupId/documents/:documentId',
  requireRoles('PORTEUR_STARTUP'),
  patchDealRoomDocumentHandler,
);
