export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown | undefined;
  readonly operational: boolean;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
    operational = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.operational = operational;
    Error.captureStackTrace(this, AppError);
  }

  static badRequest(message = 'Requête invalide.', details?: unknown): AppError {
    return new AppError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Authentification requise.'): AppError {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Accès refusé.'): AppError {
    return new AppError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Ressource introuvable.'): AppError {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'La ressource existe déjà.'): AppError {
    return new AppError(409, 'CONFLICT', message);
  }
}
