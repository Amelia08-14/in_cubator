import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { AppRole } from "@/lib/auth-contract";

export async function requirePageRoles(
  allowedRoles: readonly AppRole[],
  loginPath = "/connexion",
) {
  // Les pages réservées à l'équipe lisent la session de l'administration.
  const realm = allowedRoles.some((role) => role === "ADMIN" || role === "GESTIONNAIRE") ? "admin" : "member";
  const session = await auth(realm);

  if (!session?.user) {
    redirect(loginPath);
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/403");
  }

  return session;
}
