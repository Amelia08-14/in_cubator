import { Router } from 'express';

import { authRateLimiter } from '../../middleware/rate-limiters.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { createUserHandler, listUsersHandler, patchUserHandler, resetPasswordHandler } from './user.controller.js';

// Gestion des utilisateurs : réservée aux administrateurs, jamais déléguée à un manager.
export const adminUsersRouter = Router();

adminUsersRouter.use(requireAuth, requireRoles('ADMIN'));
adminUsersRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

adminUsersRouter.get('/', listUsersHandler);
adminUsersRouter.post('/', createUserHandler);
adminUsersRouter.patch('/:id', patchUserHandler);
adminUsersRouter.post('/:id/reset-password', authRateLimiter, resetPasswordHandler);
