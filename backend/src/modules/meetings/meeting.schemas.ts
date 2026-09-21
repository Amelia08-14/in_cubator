import { z } from 'zod';

const meetingTypes = ['MENTORAT', 'INVESTISSEUR', 'AUTRE'] as const;
const meetingStatuses = ['DEMANDE', 'CONFIRME', 'ANNULE', 'TERMINE'] as const;
const id = z.string().trim().min(1).max(191);
const page = z.coerce.number().int().min(1).default(1);
const pageSize = z.coerce.number().int().min(1).max(100);

export const meetingListQuerySchema = z
  .strictObject({
    page,
    pageSize: pageSize.optional(),
    limit: pageSize.optional(),
    type: z.enum(meetingTypes).optional(),
    statut: z.enum(meetingStatuses).optional(),
    startupId: id.optional(),
    mentorId: id.optional(),
    investisseurId: id.optional(),
  })
  .transform(({ limit, pageSize: requestedPageSize, ...query }) => ({
    ...query,
    pageSize: requestedPageSize ?? limit ?? 20,
  }));

export const bookMeetingSchema = z.strictObject({
  disponibiliteId: id,
});

export const meetingIdSchema = id;

export const patchMeetingSchema = z
  .strictObject({
    statut: z.enum(['CONFIRME', 'ANNULE', 'TERMINE']).optional(),
    notes: z.string().trim().max(5_000).optional(),
    noteMentorat: z.number().int().min(1).max(5).optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Au moins un champ doit être fourni.',
  });

export type MeetingListQuery = z.infer<typeof meetingListQuerySchema>;
export type BookMeetingInput = z.infer<typeof bookMeetingSchema>;
export type PatchMeetingInput = z.infer<typeof patchMeetingSchema>;
