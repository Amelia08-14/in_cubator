"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClientV2, ClientApiError } from "@/lib/api-client-v2";
import type { AuthUser } from "@/lib/auth-contract";

type AuthPayload = { user: AuthUser };

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => (await apiClientV2<AuthPayload>("/auth/me")).user,
    retry: false,
    staleTime: 60_000,
    throwOnError: false,
  });
}

export async function login(email: string, password: string) {
  return (await apiClientV2<AuthPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })).user;
}

export async function register(email: string, password: string) {
  return (await apiClientV2<AuthPayload>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, role: "PORTEUR_STARTUP" }),
  })).user;
}

export async function logout() {
  await apiClientV2<void>("/auth/logout", { method: "POST" });
}

export function authErrorMessage(error: unknown, fallback: string) {
  return error instanceof ClientApiError ? error.message : fallback;
}

export function useLogout(defaultDestination = "/connexion") {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async (destination = defaultDestination) => {
    try {
      await logout();
    } finally {
      queryClient.removeQueries({ queryKey: ["auth"] });
      router.push(destination);
      router.refresh();
    }
  };
}
