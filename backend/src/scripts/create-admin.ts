import bcrypt from 'bcryptjs';

import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { registerSchema } from '../modules/auth/auth.schemas.js';

/**
 * Crée (ou réinitialise) un compte de l'équipe : ADMIN ou GESTIONNAIRE.
 *
 * À utiliser en production à la place du seed de démonstration, qui crée des
 * comptes aux mots de passe connus et ne doit JAMAIS y être exécuté.
 *
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node dist/scripts/create-admin.js
 *
 * Variables : ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE (ADMIN par défaut ou
 * GESTIONNAIRE), ADMIN_RESET=1 pour réinitialiser un compte existant.
 * Le mot de passe suit les mêmes règles que l'inscription (12 caractères mini,
 * majuscule, minuscule, chiffre).
 */
async function main(): Promise<void> {
  const role = process.env.ADMIN_ROLE === 'GESTIONNAIRE' ? 'GESTIONNAIRE' : 'ADMIN';
  const parsed = registerSchema
    .pick({ email: true, password: true })
    .safeParse({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });

  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `- ${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`ADMIN_EMAIL / ADMIN_PASSWORD invalides :\n${problems.join('\n')}`);
  }

  const { email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (existing && process.env.ADMIN_RESET !== '1') {
    throw new Error(`Le compte ${email} existe déjà. Relancez avec ADMIN_RESET=1 pour le réinitialiser.`);
  }

  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, role, actif: true } });
    // Toutes les sessions ouvertes de ce compte sont révoquées.
    await prisma.refreshSession.updateMany({ where: { userId: existing.id, revokedAt: null }, data: { revokedAt: new Date() } });
    console.log(`Compte ${role} réinitialisé : ${email}`);
  } else {
    await prisma.user.create({ data: { email, passwordHash, role } });
    console.log(`Compte ${role} créé : ${email}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
