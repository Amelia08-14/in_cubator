import { Router } from 'express';

import { requireAuth, requireSection } from '../../middleware/auth.js';
import { publicEventRegistrationRateLimiter } from '../../middleware/rate-limiters.js';
import {
  createEventHandler,
  deleteEventHandler,
  getPublicEventHandler,
  listAdminEventsHandler,
  listPublicEventsHandler,
  listRegistrationsHandler,
  patchEventHandler,
  patchRegistrationHandler,
  registerHandler,
} from './event.controller.js';

// Site public : consultation libre, inscription sans compte (limitée en débit).
export const eventsRouter = Router();

eventsRouter.get('/', listPublicEventsHandler);
eventsRouter.get('/:slug', getPublicEventHandler);
eventsRouter.post('/:slug/registrations', publicEventRegistrationRateLimiter, registerHandler);

// Back-office : réservé à l'équipe.
export const adminEventsRouter = Router();

adminEventsRouter.use(requireAuth, requireSection('evenements'));
adminEventsRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

adminEventsRouter.get('/', listAdminEventsHandler);
adminEventsRouter.post('/', createEventHandler);
adminEventsRouter.patch('/:id', patchEventHandler);
adminEventsRouter.delete('/:id', deleteEventHandler);
adminEventsRouter.get('/:id/registrations', listRegistrationsHandler);
adminEventsRouter.patch('/:id/registrations/:registrationId', patchRegistrationHandler);
