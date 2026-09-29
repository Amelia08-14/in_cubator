import { Router } from 'express';

import { requireAuth, requireRoles, requireSection } from '../../middleware/auth.js';
import {
  createMentorHandler,
  createOwnDisponibiliteHandler,
  deleteOwnDisponibiliteHandler,
  getOwnMentorProfileHandler,
  listMentorsForAdminHandler,
  listPublicMentorsHandler,
  patchOwnMentorProfileHandler,
  putOwnMentorProfileHandler,
  setMentorActivationHandler,
} from './mentor.controller.js';

export const mentorsRouter = Router();
export const adminMentorsRouter = Router();

mentorsRouter.get('/', listPublicMentorsHandler);
mentorsRouter.get(
  '/me/profile',
  requireAuth,
  requireRoles('MENTOR_EXPERT'),
  getOwnMentorProfileHandler,
);
mentorsRouter.put(
  '/me/profile',
  requireAuth,
  requireRoles('MENTOR_EXPERT'),
  putOwnMentorProfileHandler,
);
mentorsRouter.patch(
  '/me/profile',
  requireAuth,
  requireRoles('MENTOR_EXPERT'),
  patchOwnMentorProfileHandler,
);
mentorsRouter.post(
  '/me/disponibilites',
  requireAuth,
  requireRoles('MENTOR_EXPERT'),
  createOwnDisponibiliteHandler,
);
mentorsRouter.delete(
  '/me/disponibilites/:id',
  requireAuth,
  requireRoles('MENTOR_EXPERT'),
  deleteOwnDisponibiliteHandler,
);

adminMentorsRouter.use(requireAuth, requireSection('mentors'));
adminMentorsRouter.get('/', listMentorsForAdminHandler);
adminMentorsRouter.post('/', createMentorHandler);
adminMentorsRouter.patch('/:id/activation', setMentorActivationHandler);
