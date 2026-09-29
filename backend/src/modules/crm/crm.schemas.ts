import { z } from 'zod';

export const LEAD_STAGES = [
  'NOUVEAU',
  'DIAGNOSTIC',
  'ACCOMPAGNEMENT',
  'TEST_TERRAIN',
  'RESEAU',
  'FORMATIONS',
  'LANCEMENT',
] as const;
export const LEAD_STATUSES = ['OUVERT', 'GAGNE', 'PERDU'] as const;
export const LEAD_TYPES = ['STARTUP', 'INVESTISSEUR', 'PARTENAIRE', 'MENTOR', 'DIASPORA', 'AUTRE'] as const;
export const LEAD_SOURCES = [
  'SITE_WEB',
  'CANDIDATURE',
  'EVENEMENT',
  'RECOMMANDATION',
  'PARTENAIRE',
  'RESEAUX_SOCIAUX',
  'TELEPHONE',
  'IN_NETWORK',
  'AUTRE',
] as const;
export const ACTIVITY_TYPES = ['NOTE', 'APPEL', 'EMAIL', 'REUNION', 'TACHE'] as const;

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.null()])
    .optional()
    .transform((value) => (value === '' ? null : value));

const requiredText = (max: number) => z.string().trim().min(1, 'Ce champ est obligatoire.').max(max);

const optionalEmail = z
  .union([z.string().trim().email('Adresse email invalide.').max(191), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value));

export const leadIdSchema = z.strictObject({ id: z.string().trim().min(1).max(191) });

export const leadListQuerySchema = z.strictObject({
  status: z.enum(LEAD_STATUSES).optional(),
  stage: z.enum(LEAD_STAGES).optional(),
  type: z.enum(LEAD_TYPES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  assignedToId: z.string().trim().min(1).max(191).optional(),
  unassigned: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  q: z.string().trim().min(1).max(100).optional(),
});

export const createLeadSchema = z.strictObject({
  title: requiredText(191),
  contactName: requiredText(191),
  email: optionalEmail,
  phone: optionalText(60),
  companyName: optionalText(191),
  type: z.enum(LEAD_TYPES).default('STARTUP'),
  source: z.enum(LEAD_SOURCES).default('AUTRE'),
  stage: z.enum(LEAD_STAGES).default('NOUVEAU'),
  priority: z.number().int().min(0).max(3).default(0),
  score: z.number().int().min(0).max(100).nullable().optional(),
  message: optionalText(4000),
  assignedToId: z.union([z.string().trim().min(1).max(191), z.null()]).optional(),
});

export const patchLeadSchema = z
  .strictObject({
    title: requiredText(191),
    contactName: requiredText(191),
    email: optionalEmail,
    phone: optionalText(60),
    companyName: optionalText(191),
    type: z.enum(LEAD_TYPES),
    source: z.enum(LEAD_SOURCES),
    stage: z.enum(LEAD_STAGES),
    priority: z.number().int().min(0).max(3),
    score: z.number().int().min(0).max(100).nullable(),
    message: optionalText(4000),
    assignedToId: z.union([z.string().trim().min(1).max(191), z.null()]),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Aucune modification fournie.' });

export const loseLeadSchema = z.strictObject({
  reason: requiredText(191),
});

export const createActivitySchema = z.strictObject({
  type: z.enum(ACTIVITY_TYPES).default('NOTE'),
  content: requiredText(4000),
  dueAt: z.coerce.date().nullable().optional(),
});

export const activityIdSchema = z.strictObject({ id: z.string().trim().min(1).max(191) });

// Formulaire public du site : les profils sont mappés vers les types de lead.
export const publicLeadSchema = z.strictObject({
  contactName: requiredText(120),
  email: z.string().trim().email('Adresse email invalide.').max(191),
  phone: optionalText(60),
  companyName: optionalText(191),
  profile: z.enum(['STARTUP', 'INVESTISSEUR', 'PARTENAIRE', 'MENTOR', 'DIASPORA']).default('STARTUP'),
  message: optionalText(2000),
  source: z.enum(LEAD_SOURCES).default('SITE_WEB'),
  // Champ piège : un humain ne le remplit pas.
  website: z.string().max(200).optional(),
});

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type PatchLeadInput = z.infer<typeof patchLeadSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type PublicLeadInput = z.infer<typeof publicLeadSchema>;
