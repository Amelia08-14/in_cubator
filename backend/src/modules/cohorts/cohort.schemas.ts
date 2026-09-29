import { z } from 'zod';

export const COHORT_STATUSES = ['OUVERTE_CANDIDATURES', 'EN_COURS', 'TERMINEE'] as const;

const name = z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(120);

export const cohortIdSchema = z.strictObject({ id: z.string().trim().min(1).max(191) });

export const createCohortSchema = z
  .strictObject({
    nom: name,
    dateDebut: z.coerce.date(),
    dateFin: z.coerce.date(),
    statut: z.enum(COHORT_STATUSES).default('OUVERTE_CANDIDATURES'),
  })
  .refine((value) => value.dateFin > value.dateDebut, {
    path: ['dateFin'],
    message: 'La date de fin doit être postérieure à la date de début.',
  });

export const patchCohortSchema = z
  .strictObject({
    nom: name,
    dateDebut: z.coerce.date(),
    dateFin: z.coerce.date(),
    statut: z.enum(COHORT_STATUSES),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Aucune modification fournie.' });

export type CreateCohortInput = z.infer<typeof createCohortSchema>;
export type PatchCohortInput = z.infer<typeof patchCohortSchema>;
