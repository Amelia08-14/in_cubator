import { REALM_HEADER, realmOfPath } from "@/lib/realm-shared";

/**
 * `fetch` qui indique à l'API dans quel espace on se trouve : depuis une page
 * /admin, la session de l'administration est utilisée ; ailleurs, celle des membres.
 * À utiliser pour les appels aux Route Handlers `/api/*` communs aux deux espaces.
 */
export function realmFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (typeof window !== "undefined" && realmOfPath(window.location.pathname) === "admin") {
    headers.set(REALM_HEADER, "admin");
  }

  return fetch(input, { ...init, headers });
}
