import { z } from 'zod';

import { ADMIN_SECTIONS } from '../../config/permissions.js';
import { registerSchema } from '../auth/auth.schemas.js';

// Comptes de l'équipe : administrateur (accès total) ou manager (sections choisies).
export const STAFF_ROLES = ['ADMIN', 'GESTIONNAIRE'] as const;

const fullName = z.string().trim().min(2, 'Indiquez le nom complet.').max(120);
const sections = z.array(z.enum(ADMIN_SECTIONS)).max(ADMIN_SECTIONS.length);

export const userIdSchema = z.strictObject({ id: z.string().trim().min(1).max(191) });

export const createUserSchema = z
  .strictObject({
    fullName,
    email: registerSchema.shape.email,
    role: z.enum(STAFF_ROLES),
    // Un manager ne voit que ces sections ; ignoré pour un administrateur.
    sections: sections.default([]),
    // Absent : un mot de passe temporaire est généré.
    password: registerSchema.shape.password.optional(),
  })
  .refine((value) => value.role !== 'GESTIONNAIRE' || value.sections.length > 0, {
    path: ['sections'],
    message: 'Cochez au moins une section pour ce manager.',
  });

export const patchUserSchema = z
  .strictObject({
    fullName,
    role: z.enum(STAFF_ROLES),
    sections,
    actif: z.boolean(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Aucune modification fournie.' });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PatchUserInput = z.infer<typeof patchUserSchema>;
