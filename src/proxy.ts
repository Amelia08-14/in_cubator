import { NextResponse, type NextRequest } from "next/server";

import { REALM_COOKIES, realmOfPath } from "@/lib/realm-shared";

const protectedRoutes = ["/admin", "/espace-mentor", "/espace-investisseur", "/espace"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminLogin = pathname === "/admin/connexion";
  const isProtected = protectedRoutes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  // Chaque espace lit sa propre session : l'administration ne voit pas les
  // cookies des membres, et inversement.
  const cookieNames = REALM_COOKIES[realmOfPath(pathname)];
  const hasSessionCookie = Boolean(
    request.cookies.get(cookieNames.access)?.value || request.cookies.get(cookieNames.refresh)?.value,
  );

  if (isProtected && !isAdminLogin && !hasSessionCookie) {
    const loginPath = pathname.startsWith("/admin") ? "/admin/connexion" : "/connexion";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
