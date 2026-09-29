/**
 * Deux sessions indépendantes : « member » (startups, mentors, investisseurs)
 * et « admin » (équipe IN-CUBATOR). Chaque royaume a ses propres cookies, ce qui
 * permet d'être connecté aux deux dans le même navigateur sans qu'ils se mélangent.
 *
 * Module sans dépendance serveur : utilisable dans le proxy, les composants
 * serveur et les composants client.
 */
export type AuthRealm = "member" | "admin";

export const REALM_HEADER = "x-auth-realm";

export const REALM_COOKIES: Record<AuthRealm, { access: string; refresh: string }> = {
  member: { access: "in_cubator_access", refresh: "in_cubator_refresh" },
  admin: { access: "in_cubator_admin_access", refresh: "in_cubator_admin_refresh" },
};

/** Les URL de l'administration commencent toujours par /admin. */
export function realmOfPath(pathname: string): AuthRealm {
  return pathname === "/admin" || pathname.startsWith("/admin/") ? "admin" : "member";
}
