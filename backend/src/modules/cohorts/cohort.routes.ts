import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  cohortOverviewHandler,
  createCohortHandler,
  listCohortsHandler,
  patchCohortHandler,
} from './cohort.controller.js';

export const cohortsRouter = Router();

cohortsRouter.use(requireAuth, requireRoles('ADMIN', 'GESTIONNAIRE'));
cohortsRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

cohortsRouter.get('/', listCohortsHandler);
cohortsRouter.post('/', createCohortHandler);
cohortsRouter.get('/:id/overview', cohortOverviewHandler);
cohortsRouter.patch('/:id', patchCohortHandler);
