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

// Formulaire public de contact : peu de demandes légitimes par adresse IP.
export const publicLeadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitBody,
});

// Inscription publique à un évènement : quelques inscriptions légitimes par IP et par heure.
export const publicEventRegistrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitBody,
});
