import { z } from 'zod';

const roadmapStatuses = ['A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD'] as const;

export const roadmapIdSchema = z.string().trim().min(1).max(191);

const nullableText = z
  .union([z.string().trim().max(10_000), z.literal(''), z.null()])
  .transform((value) => (value === '' ? null : value));

const nullableDate = z
  .union([z.string().datetime({ offset: true }), z.null()])
  .transform((value) => (value === null ? null : new Date(value)));

const objectiveFields = {
  titre: z.string().trim().min(2).max(191),
  description: nullableText,
  dateEcheance: nullableDate,
  statut: z.enum(roadmapStatuses),
};

export const createObjectiveSchema = z.strictObject({
  titre: objectiveFields.titre,
  description: objectiveFields.description.optional(),
  dateEcheance: objectiveFields.dateEcheance.optional(),
  statut: objectiveFields.statut.default('A_FAIRE'),
});

export const patchObjectiveSchema = z
  .strictObject({
    titre: objectiveFields.titre.optional(),
    description: objectiveFields.description.optional(),
    dateEcheance: objectiveFields.dateEcheance.optional(),
    statut: objectiveFields.statut.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Au moins un champ doit être fourni.',
  });

const taskFields = {
  titre: z.string().trim().min(2).max(191),
  objectifId: roadmapIdSchema.nullable(),
  assigneA: roadmapIdSchema.nullable(),
  dateEcheance: nullableDate,
  statut: z.enum(roadmapStatuses),
};

export const createTaskSchema = z.strictObject({
  titre: taskFields.titre,
  objectifId: taskFields.objectifId.optional(),
  assigneA: taskFields.assigneA.optional(),
  dateEcheance: taskFields.dateEcheance.optional(),
  statut: taskFields.statut.default('A_FAIRE'),
});

export const createObjectiveTaskSchema = z.strictObject({
  titre: taskFields.titre,
  assigneA: taskFields.assigneA.optional(),
  dateEcheance: taskFields.dateEcheance.optional(),
  statut: taskFields.statut.default('A_FAIRE'),
});

export const patchTaskSchema = z
  .strictObject({
    titre: taskFields.titre.optional(),
    objectifId: taskFields.objectifId.optional(),
    assigneA: taskFields.assigneA.optional(),
    dateEcheance: taskFields.dateEcheance.optional(),
    statut: taskFields.statut.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Au moins un champ doit être fourni.',
  });

export type CreateObjectiveInput = z.infer<typeof createObjectiveSchema>;
export type PatchObjectiveInput = z.infer<typeof patchObjectiveSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type PatchTaskInput = z.infer<typeof patchTaskSchema>;
