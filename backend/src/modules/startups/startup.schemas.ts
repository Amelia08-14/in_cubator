import { z } from 'zod';

const startupStages = ['IDEE', 'PROTOTYPE', 'EARLY_TRACTION', 'SCALE'] as const;

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

const nullableAssetUrl = z
  .union([
    httpUrl,
    z.string().trim().regex(/^\/[A-Za-z0-9][A-Za-z0-9/_.,?=&%+-]*$/).max(191),
    z.literal(''),
    z.null(),
  ])
  .transform((value) => (value === '' ? null : value));

const listPage = z.coerce.number().int().min(1).default(1);
const listPageSize = z.coerce.number().int().min(1).max(100);

export const startupListQuerySchema = z
  .strictObject({
    page: listPage,
    pageSize: listPageSize.optional(),
    limit: listPageSize.optional(),
    q: z.string().trim().min(1).max(100).optional(),
    secteur: z.string().trim().min(1).max(100).optional(),
    stade: z.enum(startupStages).optional(),
  })
  .transform(({ limit, pageSize, ...query }) => ({
    ...query,
    pageSize: pageSize ?? limit ?? 20,
  }));

export const startupIdSchema = z.string().trim().min(1).max(191);

const startupProfileFields = {
  nom: z.string().trim().min(2).max(191),
  secteurs: tagList,
  stade: z.enum(startupStages),
  description: z.string().trim().min(20).max(10_000),
  pitchResume: nullableText(5_000),
  logoUrl: nullableAssetUrl,
  siteWeb: nullableUrl,
  besoins: tagList,
  visiblePublic: z.boolean(),
};

export const putStartupProfileSchema = z.strictObject(startupProfileFields);

export const patchStartupProfileSchema = z
  .strictObject({
    nom: startupProfileFields.nom.optional(),
    secteurs: startupProfileFields.secteurs.optional(),
    stade: startupProfileFields.stade.optional(),
    description: startupProfileFields.description.optional(),
    pitchResume: startupProfileFields.pitchResume.optional(),
    logoUrl: startupProfileFields.logoUrl.optional(),
    siteWeb: startupProfileFields.siteWeb.optional(),
    besoins: startupProfileFields.besoins.optional(),
    visiblePublic: startupProfileFields.visiblePublic.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Au moins un champ doit être fourni.',
  });

export type StartupListQuery = z.infer<typeof startupListQuerySchema>;
export type PutStartupProfileInput = z.infer<typeof putStartupProfileSchema>;
export type PatchStartupProfileInput = z.infer<typeof patchStartupProfileSchema>;
