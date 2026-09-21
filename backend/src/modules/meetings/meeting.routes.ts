import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  bookMentorSlotHandler,
  listMeetingsHandler,
  patchMeetingHandler,
} from './meeting.controller.js';

export const meetingsRouter = Router();

meetingsRouter.use(requireAuth);

meetingsRouter.get(
  '/',
  requireRoles('PORTEUR_STARTUP', 'MENTOR_EXPERT', 'INVESTISSEUR', 'GESTIONNAIRE', 'ADMIN'),
  listMeetingsHandler,
);
meetingsRouter.post('/', requireRoles('PORTEUR_STARTUP'), bookMentorSlotHandler);
meetingsRouter.patch(
  '/:id',
  requireRoles('PORTEUR_STARTUP', 'MENTOR_EXPERT', 'INVESTISSEUR', 'GESTIONNAIRE', 'ADMIN'),
  patchMeetingHandler,
);
