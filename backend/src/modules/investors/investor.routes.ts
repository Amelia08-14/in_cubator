import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  getOwnInvestorPreferencesHandler,
  putOwnInvestorPreferencesHandler,
} from './investor.controller.js';

export const investorsRouter = Router();

investorsRouter.use(requireAuth);
investorsRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

investorsRouter.get(
  '/me/preferences',
  requireRoles('INVESTISSEUR', 'ADMIN', 'GESTIONNAIRE'),
  getOwnInvestorPreferencesHandler,
);
investorsRouter.put(
  '/me/preferences',
  requireRoles('INVESTISSEUR'),
  putOwnInvestorPreferencesHandler,
);
