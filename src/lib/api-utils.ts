import { auth } from "@/auth";
import { currentRealm } from "@/lib/realm";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export type ApiResponse<T> = {
  data?: T;
  meta?: {
    page: number;
    total: number;
    limit: number;
  };
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[] | string>;
  };
};

export function successResponse<T>(data: T, meta?: ApiResponse<T>['meta'], status = 200) {
  return NextResponse.json({ data, meta }, { status });
}

export function errorResponse(code: string, message: string, fields?: Record<string, string[] | string>, status = 400) {
  return NextResponse.json(
    { error: { code, message, fields } },
    { status }
  );
}

/**
 * Validates that the current user has one of the allowed roles.
 * Must be called at the beginning of API route handlers.
 * @param allowedRoles Array of Role enums allowed to access the route
 * @returns The session if authorized, or a NextResponse with 401/403 error.
 */
export async function requireRole(allowedRoles: Role[]) {
  const session = await auth(await currentRealm());

  if (!session?.user) {
    return {
      session: null,
      error: errorResponse('UNAUTHORIZED', 'Non authentifié', undefined, 401)
    };
  }

  const userRole = session.user.role as Role;

  if (!allowedRoles.includes(userRole)) {
    return {
      session,
      error: errorResponse('FORBIDDEN', 'Rôle insuffisant', undefined, 403)
    };
  }

  return { session, error: null };
}
