import { z } from 'zod';

const startupStages = ['IDEE', 'PROTOTYPE', 'EARLY_TRACTION', 'SCALE'] as const;
const applicationStatuses = [
  'SOUMISE',
  'EN_EVALUATION',
  'ENTRETIEN_PLANIFIE',
  'ACCEPTEE',
  'LISTE_ATTENTE',
  'REFUSEE',
] as const;
const decisionStatuses = [
  'EN_EVALUATION',
  'ENTRETIEN_PLANIFIE',
  'ACCEPTEE',
  'LISTE_ATTENTE',
  'REFUSEE',
] as const;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string().max(20_000),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema).max(500),
    z.record(z.string().min(1).max(200), jsonValueSchema),
  ]),
);

const responsesSchema = z
  .record(z.string().min(1).max(200), jsonValueSchema)
  .refine((responses) => Object.keys(responses).length > 0, {
    message: 'Au moins une réponse est requise.',
  })
  .refine((responses) => Object.keys(responses).length <= 300, {
    message: 'Le nombre maximal de réponses est dépassé.',
  });

const tagList = z
  .array(z.string().trim().min(1).max(100))
  .min(1)
  .max(30)
  .transform((values) => [...new Set(values)]);

const httpUrl = z
  .string()
  .trim()
  .max(191)
  .url()
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), {
    message: 'Seules les URL HTTP et HTTPS sont acceptées.',
  });

const optionalLinkedin = z
  .union([httpUrl, z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value));

const teamMemberSchema = z.strictObject({
  nom: z.string().trim().min(2).max(191),
  role: z.string().trim().min(2).max(191),
  linkedin: optionalLinkedin,
});

const startupSubmissionFields = {
  nom: z.string().trim().min(2).max(191),
  secteurs: tagList,
  stade: z.enum(startupStages),
  description: z.string().trim().min(20).max(10_000),
  besoins: tagList,
  membres: z.array(teamMemberSchema).min(1).max(30),
};

const startupSubmissionSchema = z.strictObject(startupSubmissionFields);

const startupSubmissionPatchSchema = z
  .strictObject({
    nom: startupSubmissionFields.nom.optional(),
    secteurs: startupSubmissionFields.secteurs.optional(),
    stade: startupSubmissionFields.stade.optional(),
    description: startupSubmissionFields.description.optional(),
    besoins: startupSubmissionFields.besoins.optional(),
    membres: startupSubmissionFields.membres.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Au moins un champ startup doit être fourni.',
  });

export const createApplicationSchema = z.strictObject({
  startup: startupSubmissionSchema,
  reponses: responsesSchema,
});

export const patchOwnApplicationSchema = z
  .strictObject({
    startup: startupSubmissionPatchSchema.optional(),
    reponses: responsesSchema.optional(),
  })
  .refine((input) => input.startup !== undefined || input.reponses !== undefined, {
    message: 'Au moins une modification doit être fournie.',
  });

const page = z.coerce.number().int().min(1).default(1);
const pageSize = z.coerce.number().int().min(1).max(100);

export const adminApplicationListQuerySchema = z
  .strictObject({
    page,
    pageSize: pageSize.optional(),
    limit: pageSize.optional(),
    statut: z.enum(applicationStatuses).optional(),
    cohorteId: z.string().trim().min(1).max(191).optional(),
    q: z.string().trim().min(1).max(100).optional(),
  })
  .transform(({ limit, pageSize: requestedPageSize, ...query }) => ({
    ...query,
    pageSize: requestedPageSize ?? limit ?? 20,
  }));

export const applicationIdSchema = z.string().trim().min(1).max(191);

export const applicationDecisionSchema = z
  .strictObject({
    statut: z.enum(decisionStatuses),
    score: z.number().int().min(0).max(100).optional(),
    motifDecision: z
      .union([z.string().trim().min(10).max(5_000), z.literal(''), z.null()])
      .optional()
      .transform((value) => (value === '' ? null : value)),
  })
  .superRefine((input, context) => {
    if (input.statut === 'REFUSEE' && !input.motifDecision) {
      context.addIssue({
        code: 'custom',
        path: ['motifDecision'],
        message: 'Un motif est requis en cas de refus.',
      });
    }
  });

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type PatchOwnApplicationInput = z.infer<typeof patchOwnApplicationSchema>;
export type AdminApplicationListQuery = z.infer<typeof adminApplicationListQuerySchema>;
export type ApplicationDecisionInput = z.infer<typeof applicationDecisionSchema>;
