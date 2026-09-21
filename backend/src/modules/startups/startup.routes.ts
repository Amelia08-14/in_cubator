import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  getOwnStartupProfileHandler,
  getPublicStartupHandler,
  listPublicStartupsHandler,
  patchOwnStartupProfileHandler,
  putOwnStartupProfileHandler,
} from './startup.controller.js';

export const startupsRouter = Router();

startupsRouter.get('/', listPublicStartupsHandler);
startupsRouter.get(
  '/me/profile',
  requireAuth,
  requireRoles('PORTEUR_STARTUP'),
  getOwnStartupProfileHandler,
);
startupsRouter.put(
  '/me/profile',
  requireAuth,
  requireRoles('PORTEUR_STARTUP'),
  putOwnStartupProfileHandler,
);
startupsRouter.patch(
  '/me/profile',
  requireAuth,
  requireRoles('PORTEUR_STARTUP'),
  patchOwnStartupProfileHandler,
);
startupsRouter.get('/:id', getPublicStartupHandler);
