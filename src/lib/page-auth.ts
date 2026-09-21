import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { AppRole } from "@/lib/auth-contract";

export async function requirePageRoles(
  allowedRoles: readonly AppRole[],
  loginPath = "/connexion",
) {
  const session = await auth();

  if (!session?.user) {
    redirect(loginPath);
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/403");
  }

  return session;
}
