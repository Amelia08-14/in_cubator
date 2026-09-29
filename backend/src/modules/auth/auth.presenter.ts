import { sectionsFor } from '../../config/permissions.js';
import type { PublicUser } from './auth.service.js';

/** Forme du compte renvoyée au navigateur : les permissions brutes deviennent la liste des sections accessibles. */
export function presentUser(user: PublicUser) {
  const { permissions, ...rest } = user;
  return { ...rest, sections: sectionsFor(user.role, permissions) };
}
