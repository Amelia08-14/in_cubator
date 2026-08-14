/**
 * Auth helper utilities for role-based routing and session access.
 */

/**
 * Returns the dashboard path for a given user role.
 */
export function getDashboardPathForRole(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'GESTIONNAIRE':
      return '/admin';
    case 'PORTEUR_STARTUP':
      return '/espace';
    case 'MENTOR_EXPERT':
      return '/espace-mentor';
    case 'INVESTISSEUR':
      return '/espace-investisseur';
    default:
      return '/connexion';
  }
}

/**
 * Checks if a role is allowed to access a specific route prefix.
 */
export function isRoleAllowedForRoute(role: string, pathname: string): boolean {
  if (pathname.startsWith('/admin')) {
    return role === 'ADMIN' || role === 'GESTIONNAIRE';
  }
  if (pathname.startsWith('/espace-mentor')) {
    return role === 'MENTOR_EXPERT';
  }
  if (pathname.startsWith('/espace-investisseur')) {
    return role === 'INVESTISSEUR';
  }
  if (pathname.startsWith('/espace')) {
    return role === 'PORTEUR_STARTUP';
  }
  return true; // Public routes
}
