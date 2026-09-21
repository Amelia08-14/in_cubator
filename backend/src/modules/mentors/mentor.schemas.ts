import { z } from 'zod';

const tagList = z
  .array(z.string().trim().min(1).max(100))
  .max(30)
  .transform((values) => [...new Set(values)]);

const nullableText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.null()])
    .transform((value) => (value === '' ? null : value));

const httpUrl = z
  .string()
  .trim()
  .url()
  .max(191)
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), {
    message: 'Seules les URL HTTP et HTTPS sont acceptees.',
  });

const nullableUrl = z
  .union([httpUrl, z.literal(''), z.null()])
  .transform((value) => (value === '' ? null : value));

const listPage = z.coerce.number().int().min(1).default(1);
const listPageSize = z.coerce.number().int().min(1).max(100);

export const mentorListQuerySchema = z
  .strictObject({
    page: listPage,
    pageSize: listPageSize.optional(),
    limit: listPageSize.optional(),
    q: z.string().trim().min(1).max(100).optional(),
    secteur: z.string().trim().min(1).max(100).optional(),
    expertise: z.string().trim().min(1).max(100).optional(),
    langue: z.string().trim().min(1).max(100).optional(),
  })
  .transform(({ limit, pageSize, ...query }) => ({
    ...query,
    pageSize: pageSize ?? limit ?? 20,
  }));

export const adminMentorListQuerySchema = z
  .strictObject({
    page: listPage,
    pageSize: listPageSize.optional(),
    limit: listPageSize.optional(),
    q: z.string().trim().min(1).max(100).optional(),
    actif: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  })
  .transform(({ limit, pageSize, ...query }) => ({
    ...query,
    pageSize: pageSize ?? limit ?? 20,
  }));

export const mentorIdSchema = z.string().trim().min(1).max(191);

const mentorProfileFields = {
  nomComplet: z.string().trim().min(2).max(191),
  expertise: tagList,
  secteurs: tagList,
  langues: tagList,
  bio: z.string().trim().min(20).max(10_000),
  titreFonction: nullableText(191),
  linkedinUrl: nullableUrl,
  tarifIndicatif: nullableText(191),
};

export const putMentorProfileSchema = z.strictObject(mentorProfileFields);

export const patchMentorProfileSchema = z
  .strictObject({
    nomComplet: mentorProfileFields.nomComplet.optional(),
    expertise: mentorProfileFields.expertise.optional(),
    secteurs: mentorProfileFields.secteurs.optional(),
    langues: mentorProfileFields.langues.optional(),
    bio: mentorProfileFields.bio.optional(),
    titreFonction: mentorProfileFields.titreFonction.optional(),
    linkedinUrl: mentorProfileFields.linkedinUrl.optional(),
    tarifIndicatif: mentorProfileFields.tarifIndicatif.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Au moins un champ doit être fourni.',
  });

export const mentorActivationSchema = z.strictObject({ actif: z.boolean() });

export const createMentorSchema = z.strictObject({
  fullName: z.string().trim().min(2).max(191),
  email: z.string().trim().toLowerCase().email().max(191),
  password: z.string().min(8).max(191).optional(),
  expertise: tagList,
  secteurs: tagList,
  langues: tagList,
  bio: mentorProfileFields.bio,
  tarifIndicatif: mentorProfileFields.tarifIndicatif.optional(),
});

export const createDisponibiliteSchema = z
  .strictObject({
    dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Heure de début invalide.'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Heure de fin invalide.'),
    format: z.string().trim().min(1).max(50).optional(),
    type: z.string().trim().min(1).max(50).optional(),
    capacity: z.number().int().min(1).max(20).optional(),
  })
  .refine((input) => `${input.dateStr}T${input.startTime}` < `${input.dateStr}T${input.endTime}`, {
    message: "L'heure de fin doit suivre l'heure de début.",
  });

export const disponibiliteIdSchema = z.string().trim().min(1).max(191);

export type MentorListQuery = z.infer<typeof mentorListQuerySchema>;
export type CreateDisponibiliteInput = z.infer<typeof createDisponibiliteSchema>;
export type AdminMentorListQuery = z.infer<typeof adminMentorListQuerySchema>;
export type PutMentorProfileInput = z.infer<typeof putMentorProfileSchema>;
export type PatchMentorProfileInput = z.infer<typeof patchMentorProfileSchema>;
export type CreateMentorInput = z.infer<typeof createMentorSchema>;
