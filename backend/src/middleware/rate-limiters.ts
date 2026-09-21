import { rateLimit } from 'express-rate-limit';

import { env } from '../config/env.js';

const rateLimitBody = {
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Trop de requêtes. Réessayez plus tard.',
  },
};

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitBody,
});

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: rateLimitBody,
});
