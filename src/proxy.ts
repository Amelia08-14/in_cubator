import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/admin", "/espace-mentor", "/espace-investisseur", "/espace"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminLogin = pathname === "/admin/connexion";
  const isProtected = protectedRoutes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const hasSessionCookie = Boolean(
    request.cookies.get("in_cubator_access")?.value ||
      request.cookies.get("in_cubator_refresh")?.value,
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
