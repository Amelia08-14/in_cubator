import { z } from 'zod';

const tagList = z
  .array(z.string().trim().min(1).max(100))
  .max(30)
  .transform((values) => [...new Set(values)]);

const nullableText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value));

export const putInvestorPreferencesSchema = z.strictObject({
  organisation: nullableText(191),
  typeInvestisseur: nullableText(100),
  siteWeb: nullableText(191),
  bio: nullableText(10_000),
  secteursCibles: tagList.optional(),
  stadesCibles: tagList.optional(),
  ticketMin: z.number().int().min(0).nullable().optional(),
  ticketMax: z.number().int().min(0).nullable().optional(),
  zoneGeographique: nullableText(191),
  emailAlerts: z.boolean().optional(),
  watchlistAlerts: z.boolean().optional(),
  logoUrl: nullableText(2048),
});

export type PutInvestorPreferencesInput = z.infer<typeof putInvestorPreferencesSchema>;
