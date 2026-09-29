import 'dotenv/config';

import { z } from 'zod';

const booleanFromString = z.enum(['true', 'false']).transform((value) => value === 'true');

const trustProxy = z.string().default('1').transform((value, context): boolean | number => {
  if (value === 'true') return true;
  if (value === 'false') return false;

  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed >= 0) return parsed;

  context.addIssue({
    code: 'custom',
    message: 'TRUST_PROXY doit être true, false ou un entier positif.',
  });
  return z.NEVER;
});

const databaseUrl = z.string().min(1).refine(
  (value) => {
    try {
      return ['mysql:', 'mariadb:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  },
  { message: 'DATABASE_URL doit être une URL mysql:// ou mariadb:// valide.' },
);

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string().min(1).default('0.0.0.0'),
    PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
    API_PREFIX: z
      .string()
      .regex(/^\/[a-zA-Z0-9/_-]*$/, 'API_PREFIX doit commencer par /.')
      .default('/api')
      .transform((value) => value.replace(/\/$/, '') || '/'),
    TRUST_PROXY: trustProxy,

    DATABASE_URL: databaseUrl,
    DATABASE_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(100).default(10),

    CORS_ORIGINS: z.string().default('http://localhost:3000'),
    JSON_BODY_LIMIT: z.string().min(1).default('1mb'),

    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ISSUER: z.string().min(1).default('in-cubator-api'),
    JWT_AUDIENCE: z.string().min(1).default('in-cubator-web'),
    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().min(60).max(86_400).default(900),
    JWT_REFRESH_TTL_SECONDS: z.coerce
      .number()
      .int()
      .min(3_600)
      .max(31_536_000)
      .default(2_592_000),

    ACCESS_COOKIE_NAME: z.string().min(1).default('in_cubator_access'),
    REFRESH_COOKIE_NAME: z.string().min(1).default('in_cubator_refresh'),
    // Session de l'administration : cookies distincts de ceux des membres.
    ADMIN_ACCESS_COOKIE_NAME: z.string().min(1).default('in_cubator_admin_access'),
    ADMIN_REFRESH_COOKIE_NAME: z.string().min(1).default('in_cubator_admin_refresh'),
    REFRESH_COOKIE_PATH: z
      .string()
      .regex(/^\/[a-zA-Z0-9/_-]*$/, 'REFRESH_COOKIE_PATH doit commencer par /.')
      .default('/'),
    COOKIE_SECURE: booleanFromString.optional(),
    COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
    COOKIE_DOMAIN: z.string().min(1).optional(),

    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1_000).default(900_000),
    RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(200),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(10),
  })
  .superRefine((value, context) => {
    const cookieSecure = value.COOKIE_SECURE ?? value.NODE_ENV === 'production';

    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      context.addIssue({
        code: 'custom',
        path: ['JWT_REFRESH_SECRET'],
        message: 'Les secrets access et refresh doivent être différents.',
      });
    }

    if (value.COOKIE_SAME_SITE === 'none' && !cookieSecure) {
      context.addIssue({
        code: 'custom',
        path: ['COOKIE_SECURE'],
        message: 'COOKIE_SECURE=true est obligatoire avec COOKIE_SAME_SITE=none.',
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const summary = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'environment'}: ${issue.message}`)
    .join('; ');
  throw new Error(`Configuration d'environnement invalide: ${summary}`);
}

const corsOrigins = parsed.data.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

for (const origin of corsOrigins) {
  try {
    new URL(origin);
  } catch {
    throw new Error(`CORS_ORIGINS contient une origine invalide: ${origin}`);
  }
}

export const env = {
  ...parsed.data,
  COOKIE_SECURE: parsed.data.COOKIE_SECURE ?? parsed.data.NODE_ENV === 'production',
  CORS_ORIGINS: corsOrigins,
} as const;

export type AppEnvironment = typeof env;
