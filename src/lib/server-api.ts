import "server-only";

import { cookies } from "next/headers";

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

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string | string[]>;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? `API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code ?? "API_ERROR";
    this.fields = payload?.fields;
  }
}

function getApiOrigin() {
  return process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok || body.error) {
    throw new ApiError(response.status, body.error);
  }

  return body.data as T;
}

/**
 * Calls Express from a request-time Server Component.
 *
 * It forwards the auth cookies. Server Components may validate the refresh
 * session but never rotate it because they cannot propagate Set-Cookie.
 */
export async function serverApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const authCookies = ["in_cubator_access", "in_cubator_refresh"]
    .map((name) => cookieStore.get(name))
    .filter((cookie): cookie is NonNullable<typeof cookie> => Boolean(cookie))
    .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
    .join("; ");
  const headers = new Headers(init.headers);

  headers.set("accept", "application/json");
  if (authCookies) {
    headers.set("cookie", authCookies);
  }

  const response = await fetch(new URL(path, getApiOrigin()), {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });

  return parseResponse<T>(response);
}

/**
 * Public data helper. It deliberately does not call cookies(), so public pages
 * can remain cacheable and opt into Next.js revalidation.
 */
export async function publicApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");

  const response = await fetch(new URL(path, getApiOrigin()), {
    ...init,
    headers,
  });

  return parseResponse<T>(response);
}
