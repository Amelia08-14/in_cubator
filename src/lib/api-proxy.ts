import "server-only";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getApiOrigin() {
  return process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";
}

type ProxyInit = {
  method?: string;
  body?: unknown;
  searchParams?: URLSearchParams | Record<string, string | undefined>;
  /**
   * Backend handlers wrap single resources as `{ data: { <key>: resource } }`.
   * Legacy Route Handlers returned the resource directly as `data`, so pass
   * the wrapper key here to unwrap it and keep existing client code working.
   */
  unwrap?: string;
};

/**
 * Forwards a Next.js Route Handler call to the Express API, propagating auth
 * cookies and returning the backend's envelope/status verbatim. Used while
 * each legacy Route Handler is cut over from direct Prisma access.
 */
export async function proxyToApi(path: string, init: ProxyInit = {}) {
  const cookieStore = await cookies();
  const authCookies = ["in_cubator_access", "in_cubator_refresh"]
    .map((name) => cookieStore.get(name))
    .filter((cookie): cookie is NonNullable<typeof cookie> => Boolean(cookie))
    .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
    .join("; ");

  const headers = new Headers({ accept: "application/json" });
  if (authCookies) {
    headers.set("cookie", authCookies);
  }

  let body: string | undefined;
  if (init.body !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.body);
  }

  const query = new URLSearchParams(
    init.searchParams instanceof URLSearchParams
      ? init.searchParams
      : Object.entries(init.searchParams ?? {}).filter(
          (entry): entry is [string, string] => entry[1] !== undefined,
        ),
  ).toString();
  const url = new URL(path, getApiOrigin());
  if (query) {
    url.search = query;
  }

  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers,
    body,
    cache: "no-store",
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const payload = await response.json().catch(() => ({}));

  if (init.unwrap && payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as Record<string, unknown>).data;
    if (data && typeof data === "object" && init.unwrap in data) {
      return NextResponse.json(
        { ...payload, data: (data as Record<string, unknown>)[init.unwrap] },
        { status: response.status },
      );
    }
  }

  return NextResponse.json(payload, { status: response.status });
}
