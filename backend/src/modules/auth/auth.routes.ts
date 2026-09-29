import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rate-limiters.js';
import {
  adminLoginHandler,
  loginHandler,
  logoutAllHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
  sessionHandler,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

authRouter.post('/register', authRateLimiter, registerHandler);
authRouter.post('/login', authRateLimiter, loginHandler);
authRouter.post('/admin/login', authRateLimiter, adminLoginHandler);
authRouter.post('/refresh', refreshHandler);
authRouter.get('/session', sessionHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/logout-all', requireAuth, logoutAllHandler);
authRouter.get('/me', requireAuth, meHandler);
