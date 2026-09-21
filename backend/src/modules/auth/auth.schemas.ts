import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const PUBLIC_REGISTRATION_ROLES = [
  'PORTEUR_STARTUP',
  'MENTOR_EXPERT',
  'INVESTISSEUR',
  'PARTENAIRE',
] as const;

const email = z.string().trim().toLowerCase().email().max(191);

const password = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères.')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères.')
  .refine((value) => !bcrypt.truncates(value), {
    message: 'Le mot de passe ne peut pas depasser 72 octets UTF-8.',
  })
  .regex(/[a-z]/, 'Le mot de passe doit contenir une minuscule.')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule.')
  .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre.');

export const registerSchema = z.strictObject({
  email,
  password,
  role: z.enum(PUBLIC_REGISTRATION_ROLES).default('PORTEUR_STARTUP'),
});

export const loginSchema = z.strictObject({
  email,
  password: z.string().min(1).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
