import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env.js';
import { Prisma } from '../generated/prisma/client.js';
import { AppError } from './app-error.js';

interface ErrorPayload {
  error: {
    code: string;
    message: string;
    fields?: unknown;
  };
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    return AppError.badRequest('Les données envoyées sont invalides.', error.flatten().fieldErrors);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return AppError.conflict('Une ressource avec ces informations existe déjà.');
    }

    if (error.code === 'P2000') {
      return AppError.badRequest('Une valeur depasse la longueur autorisee.');
    }

    if (error.code === 'P2003') {
      return AppError.conflict('Une ressource referencee est introuvable ou encore utilisee.');
    }

    if (error.code === 'P2034') {
      return AppError.conflict('Conflit concurrent. Reessayez la requete.');
    }

    if (error.code === 'P2025') {
      return AppError.notFound();
    }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === 413
  ) {
    return new AppError(413, 'PAYLOAD_TOO_LARGE', 'Le corps de la requete est trop volumineux.');
  }

  if (
    error instanceof SyntaxError &&
    'status' in error &&
    (error as SyntaxError & { status?: number }).status === 400
  ) {
    return AppError.badRequest('Le corps JSON est invalide.');
  }

  return new AppError(500, 'INTERNAL_SERVER_ERROR', 'Une erreur interne est survenue.', undefined, false);
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const normalized = normalizeError(error);

  if (!normalized.operational || env.NODE_ENV !== 'production') {
    console.error(error);
  }

  const payload: ErrorPayload = {
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(normalized.details !== undefined ? { fields: normalized.details } : {}),
    },
  };

  response.status(normalized.statusCode).json(payload);
};
