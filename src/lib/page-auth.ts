import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { canOpenSection, type AdminAreaKey } from "@/lib/admin-sections";
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

/**
 * Page d'administration réservée à une section : un administrateur y accède
 * toujours, un manager seulement si elle lui a été accordée.
 */
export async function requireAdminSection(section: AdminAreaKey) {
  const session = await auth("admin");

  if (!session?.user) {
    redirect("/admin/connexion");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "GESTIONNAIRE") {
    redirect("/403");
  }

  if (!canOpenSection(session.user, section)) {
    // Le tableau de bord explique pourquoi la page n'est pas accessible.
    redirect("/admin?acces=refuse");
  }

  return session;
}
