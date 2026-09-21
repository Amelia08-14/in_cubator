import { z } from 'zod';

const accessStatuses = ['DEMANDE', 'ACCORDE', 'REVOQUE', 'REFUSE'] as const;
const accessDecisionStatuses = ['ACCORDE', 'REFUSE', 'REVOQUE'] as const;
const documentTypes = [
  'PITCH_DECK',
  'BUSINESS_PLAN',
  'KPI_REPORT',
  'FINANCIER',
  'CANDIDATURE',
  'AUTRE',
] as const;

const id = z.string().trim().min(1).max(191);
const page = z.coerce.number().int().min(1).default(1);
const pageSize = z.coerce.number().int().min(1).max(100);

const paginatedQuery = {
  page,
  pageSize: pageSize.optional(),
  limit: pageSize.optional(),
};

export const createAccessRequestSchema = z.strictObject({
  startupId: id,
});

export const accessRequestListQuerySchema = z
  .strictObject({
    ...paginatedQuery,
    statut: z.enum(accessStatuses).optional(),
    startupId: id.optional(),
    investisseurId: id.optional(),
  })
  .transform(({ limit, pageSize: requestedPageSize, ...query }) => ({
    ...query,
    pageSize: requestedPageSize ?? limit ?? 20,
  }));

export const accessRequestParamsSchema = z.strictObject({
  id,
});

export const accessRequestDecisionSchema = z.strictObject({
  statut: z.enum(accessDecisionStatuses),
});

export const dealRoomDocumentParamsSchema = z.strictObject({
  startupId: id,
});

export const dealRoomDocumentListQuerySchema = z
  .strictObject({
    ...paginatedQuery,
    type: z.enum(documentTypes).optional(),
  })
  .transform(({ limit, pageSize: requestedPageSize, ...query }) => ({
    ...query,
    pageSize: requestedPageSize ?? limit ?? 50,
  }));

export const createDealRoomDocumentSchema = z.strictObject({
  type: z.enum(documentTypes),
  fichierUrl: z
    .string()
    .trim()
    .regex(
      /^\/api\/files\/[a-zA-Z0-9_-]+\.(pdf|docx|xlsx|jpe?g|png|webp)$/,
      'Référence de fichier privée invalide.',
    ),
  visibleInvestisseurs: z.boolean().optional().default(false),
});

export const patchDealRoomDocumentSchema = z.strictObject({
  visibleInvestisseurs: z.boolean(),
});

export const dealRoomDocumentIdParamsSchema = z.strictObject({
  startupId: id,
  documentId: id,
});

export type CreateAccessRequestInput = z.infer<typeof createAccessRequestSchema>;
export type AccessRequestListQuery = z.infer<typeof accessRequestListQuerySchema>;
export type AccessRequestDecisionInput = z.infer<typeof accessRequestDecisionSchema>;
export type DealRoomDocumentListQuery = z.infer<typeof dealRoomDocumentListQuerySchema>;
export type CreateDealRoomDocumentInput = z.infer<typeof createDealRoomDocumentSchema>;
export type PatchDealRoomDocumentInput = z.infer<typeof patchDealRoomDocumentSchema>;
