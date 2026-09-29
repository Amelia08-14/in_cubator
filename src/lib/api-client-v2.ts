import { REALM_HEADER, realmOfPath } from "@/lib/realm-shared";

type ApiErrorPayload = {
  code: string;
  message: string;
  fields?: Record<string, string | string[]>;
};

type ApiEnvelope<T> = {
  data?: T;
  meta?: Record<string, unknown>;
  error?: ApiErrorPayload;
};

export class ClientApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string | string[]>;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? `API request failed with status ${status}`);
    this.name = "ClientApiError";
    this.status = status;
    this.code = payload?.code ?? "API_ERROR";
    this.fields = payload?.fields;
  }
}

let refreshPromise: Promise<boolean> | null = null;

// Les pages /admin utilisent la session de l'administration, toutes les autres
// celle des membres.
function realmHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return realmOfPath(window.location.pathname) === "admin" ? { [REALM_HEADER]: "admin" } : {};
}

const authPathsWithoutRefresh = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);

async function refreshAccessCookie() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/v2/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: { accept: "application/json", ...realmHeaders() },
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T>(
  path: string,
  init: RequestInit,
  mayRefresh: boolean,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  Object.entries(realmHeaders()).forEach(([key, value]) => headers.set(key, value));

  if (init.body && !(init.body instanceof FormData) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathname = normalizedPath.split("?", 1)[0]?.replace(/\/$/, "") || "/";
  const response = await fetch(`/api/v2${normalizedPath}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (
    response.status === 401 &&
    mayRefresh &&
    !authPathsWithoutRefresh.has(pathname) &&
    (await refreshAccessCookie())
  ) {
    return request<T>(normalizedPath, init, false);
  }

  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok || body.error) {
    throw new ClientApiError(response.status, body.error);
  }

  return body.data as T;
}

export async function apiClientV2<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  return request<T>(path, init, true);
}
