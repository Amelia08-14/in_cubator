import type { AdminSection } from '../config/permissions.js';
import type { Role } from '../generated/prisma/enums.js';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: Role;
        /** Sections de l'administration accessibles (équipe uniquement). */
        sections: AdminSection[];
      };
    }
  }
}

export {};
