import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  createOwnApplicationHandler,
  decideApplicationHandler,
  getApplicationForAdminHandler,
  getOwnApplicationHandler,
  listApplicationsForAdminHandler,
  patchOwnApplicationHandler,
} from './application.controller.js';

export const applicationsRouter = Router();

applicationsRouter.use(requireAuth);
applicationsRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

applicationsRouter.get('/me', requireRoles('PORTEUR_STARTUP'), getOwnApplicationHandler);
applicationsRouter.post('/me', requireRoles('PORTEUR_STARTUP'), createOwnApplicationHandler);
applicationsRouter.patch('/me', requireRoles('PORTEUR_STARTUP'), patchOwnApplicationHandler);

applicationsRouter.get(
  '/',
  requireRoles('ADMIN', 'GESTIONNAIRE'),
  listApplicationsForAdminHandler,
);
applicationsRouter.get(
  '/:id',
  requireRoles('ADMIN', 'GESTIONNAIRE'),
  getApplicationForAdminHandler,
);
applicationsRouter.patch(
  '/:id/decision',
  requireRoles('ADMIN', 'GESTIONNAIRE'),
  decideApplicationHandler,
);
