import "server-only";

import type { AuthUser } from "@/lib/auth-contract";
import { ApiError, serverApi } from "@/lib/server-api";

export type AppSession = { user: AuthUser };

export async function auth(): Promise<AppSession | null> {
  try {
    return await serverApi<AppSession>("/api/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}
