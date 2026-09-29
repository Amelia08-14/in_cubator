import { z } from 'zod';

export const EVENT_TYPES = ['CONFERENCE', 'ATELIER', 'NETWORKING', 'MASTERCLASS', 'DEMO_DAY'] as const;
export const EVENT_ORIGINS = ['IN_EVENT', 'EXTERNAL', 'CO_ORGANIZED'] as const;
export const EVENT_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export const REGISTRATION_STATUSES = ['REGISTERED', 'ATTENDED', 'CANCELLED'] as const;

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.null()])
    .optional()
    .transform((value) => (value === '' ? null : value));

const optionalUrl = z
  .union([z.string().trim().url('Adresse invalide (https://…).').max(1024), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value));

// Couverture : image envoyée depuis le back-office (chemin interne) ou adresse externe.
const UPLOADED_COVER = /^\/api\/media\/events\/[a-f0-9]{24}\.(jpg|png|webp)$/;
const coverImage = z
  .union([z.string().trim().regex(UPLOADED_COVER, 'Image invalide.'), z.string().trim().url('Adresse invalide (https://…).').max(1024), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value));

export const eventIdSchema = z.strictObject({ id: z.string().trim().min(1).max(191) });
export const eventSlugSchema = z.strictObject({ slug: z.string().trim().min(1).max(191) });
export const registrationParamsSchema = z.strictObject({
  id: z.string().trim().min(1).max(191),
  registrationId: z.string().trim().min(1).max(191),
});

const eventFields = {
  title: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caractères.').max(160),
  summary: optionalText(280),
  description: z.string().trim().min(10, "Décrivez brièvement l'évènement.").max(10000),
  type: z.enum(EVENT_TYPES),
  origin: z.enum(EVENT_ORIGINS),
  location: optionalText(191),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  capacity: z.coerce.number().int('Nombre entier attendu.').min(1, 'Au moins 1 place.').max(100000),
  coverImage,
  videoUrl: optionalUrl,
  coOrganizerName: optionalText(191),
  registrationsOpen: z.boolean(),
  status: z.enum(EVENT_STATUSES),
};

const endAfterStart = { path: ['endAt'], message: 'La fin doit être postérieure au début.' };

export const createEventSchema = z
  .strictObject({
    ...eventFields,
    origin: eventFields.origin.default('IN_EVENT'),
    registrationsOpen: eventFields.registrationsOpen.default(true),
    status: eventFields.status.default('DRAFT'),
  })
  .refine((value) => value.endAt > value.startAt, endAfterStart);

export const patchEventSchema = z
  .strictObject(eventFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, { message: 'Aucune modification fournie.' })
  .refine((value) => !value.startAt || !value.endAt || value.endAt > value.startAt, endAfterStart);

export const publicEventsQuerySchema = z.object({
  scope: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const registerSchema = z.strictObject({
  fullName: z.string().trim().min(2, 'Indiquez votre nom complet.').max(120),
  email: z.string().trim().email('Adresse email invalide.').max(191),
  phone: optionalText(60),
  organization: optionalText(191),
  message: optionalText(1000),
  // Champ piège : un humain ne le remplit pas.
  website: z.string().max(200).optional(),
});

export const patchRegistrationSchema = z.strictObject({ status: z.enum(REGISTRATION_STATUSES) });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type PatchEventInput = z.infer<typeof patchEventSchema>;
export type PublicEventsQuery = z.infer<typeof publicEventsQuerySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
