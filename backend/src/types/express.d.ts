import type { Role } from '../generated/prisma/enums.js';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
