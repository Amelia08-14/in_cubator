import type { Request } from 'express';

import type { Role } from '../generated/prisma/enums.js';
import { env } from './env.js';

/**
 * Deux sessions indépendantes cohabitent dans le même navigateur :
 * - « member » : startups, mentors, investisseurs, partenaires ;
 * - « admin » : équipe IN-CUBATOR (ADMIN, GESTIONNAIRE).
 *
 * Chaque royaume a ses propres cookies. Le client indique celui qu'il utilise
 * par l'en-tête `X-Auth-Realm` ; l'API vérifie ensuite que le rôle du compte
 * appartient bien à ce royaume, si bien qu'un jeton ne traverse jamais la frontière.
 */
export type AuthRealm = 'member' | 'admin';

export const REALM_HEADER = 'x-auth-realm';

const ADMIN_ROLES: readonly Role[] = ['ADMIN', 'GESTIONNAIRE'];

export function realmOfRequest(request: Request): AuthRealm {
  return request.get(REALM_HEADER)?.toLowerCase() === 'admin' ? 'admin' : 'member';
}

export function isAdminRole(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

export function roleBelongsToRealm(role: Role, realm: AuthRealm): boolean {
  return realm === 'admin' ? isAdminRole(role) : !isAdminRole(role);
}

export function cookieNamesFor(realm: AuthRealm): { access: string; refresh: string } {
  return realm === 'admin'
    ? { access: env.ADMIN_ACCESS_COOKIE_NAME, refresh: env.ADMIN_REFRESH_COOKIE_NAME }
    : { access: env.ACCESS_COOKIE_NAME, refresh: env.REFRESH_COOKIE_NAME };
}
