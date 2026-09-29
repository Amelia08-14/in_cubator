import type { Role } from '../generated/prisma/enums.js';

/**
 * Sections de l'administration qu'un administrateur peut accorder (ou non) à un
 * manager. Les clés sont les mêmes que côté interface (src/lib/admin-sections.ts).
 *
 * - ADMIN : accès à tout, y compris la gestion des utilisateurs (jamais délégable).
 * - GESTIONNAIRE (« Manager ») : uniquement les sections cochées. Un compte
 *   antérieur à cette fonction (permissions à null) garde l'accès qu'il avait
 *   à toutes les sections ci-dessous, mais jamais à la gestion des utilisateurs.
 * - Tableau de bord : ouvert à toute l'équipe.
 */
export const ADMIN_SECTIONS = [
  'crm',
  'candidatures',
  'cohortes',
  'startups',
  'mentors',
  'open-innovation',
  'evenements',
  'bibliotheque',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

const KNOWN = new Set<string>(ADMIN_SECTIONS);

export function isAdminSection(value: unknown): value is AdminSection {
  return typeof value === 'string' && KNOWN.has(value);
}

/** Liste enregistrée en base, nettoyée ; `null` si rien n'a été enregistré. */
export function parseStoredSections(value: unknown): AdminSection[] | null {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.filter(isAdminSection))];
}

/** Sections réellement accessibles pour un compte. */
export function sectionsFor(role: Role, stored: unknown): AdminSection[] {
  if (role === 'ADMIN') return [...ADMIN_SECTIONS];
  if (role === 'GESTIONNAIRE') return parseStoredSections(stored) ?? [...ADMIN_SECTIONS];
  return [];
}

export function canAccessSection(role: Role, stored: unknown, section: AdminSection): boolean {
  return sectionsFor(role, stored).includes(section);
}
