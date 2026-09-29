import "server-only";

import { cookies, headers } from "next/headers";

import { REALM_COOKIES, REALM_HEADER, realmOfPath, type AuthRealm } from "@/lib/realm-shared";

/**
 * Royaume d'une requête reçue par un Route Handler.
 *
 * 1. l'en-tête `X-Auth-Realm`, posé par les clients de l'administration ;
 * 2. à défaut (lien, téléchargement), le Referer : une page /admin appelle
 *    l'administration.
 *
 * Les pages (Server Components) ne l'utilisent pas : elles déclarent leur
 * royaume explicitement.
 */
export async function currentRealm(): Promise<AuthRealm> {
  const requestHeaders = await headers();

  if (requestHeaders.get(REALM_HEADER)?.toLowerCase() === "admin") {
    return "admin";
  }

  const referer = requestHeaders.get("referer");
  if (referer) {
    try {
      return realmOfPath(new URL(referer).pathname);
    } catch {
      // Referer illisible : on reste côté membre.
    }
  }

  return "member";
}

/** En-tête `Cookie` à transmettre à l'API pour un royaume donné. */
export async function authCookieHeader(realm: AuthRealm): Promise<string> {
  const cookieStore = await cookies();
  return [REALM_COOKIES[realm].access, REALM_COOKIES[realm].refresh]
    .map((name) => cookieStore.get(name))
    .filter((cookie): cookie is NonNullable<typeof cookie> => Boolean(cookie))
    .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
    .join("; ");
}
