import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { publicLeadRateLimiter } from '../../middleware/rate-limiters.js';
import {
  addActivityHandler,
  completeActivityHandler,
  createLeadHandler,
  createPublicLeadHandler,
  deleteActivityHandler,
  deleteLeadHandler,
  getLeadHandler,
  listLeadsHandler,
  loseLeadHandler,
  patchLeadHandler,
  reopenLeadHandler,
  staffHandler,
  statsHandler,
  winLeadHandler,
} from './crm.controller.js';

export const crmRouter = Router();

// Formulaire de contact du site : public, limité en débit.
crmRouter.post('/public/leads', publicLeadRateLimiter, createPublicLeadHandler);

// Tout le reste est réservé à l'équipe.
crmRouter.use(requireAuth, requireRoles('ADMIN', 'GESTIONNAIRE'));
crmRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

crmRouter.get('/stats', statsHandler);
crmRouter.get('/staff', staffHandler);
crmRouter.get('/leads', listLeadsHandler);
crmRouter.post('/leads', createLeadHandler);
crmRouter.get('/leads/:id', getLeadHandler);
crmRouter.patch('/leads/:id', patchLeadHandler);
crmRouter.post('/leads/:id/win', winLeadHandler);
crmRouter.post('/leads/:id/lose', loseLeadHandler);
crmRouter.post('/leads/:id/reopen', reopenLeadHandler);
crmRouter.delete('/leads/:id', requireRoles('ADMIN'), deleteLeadHandler);
crmRouter.post('/leads/:id/activities', addActivityHandler);
crmRouter.post('/activities/:id/complete', completeActivityHandler);
crmRouter.delete('/activities/:id', deleteActivityHandler);
