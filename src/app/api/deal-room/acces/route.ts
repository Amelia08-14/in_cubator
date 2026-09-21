import { proxyToApi } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return proxyToApi("/api/deal-room/access-requests", {
    searchParams: {
      startupId: searchParams.get("startupId") ?? undefined,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/deal-room/access-requests", {
    method: "POST",
    body,
    unwrap: "accessRequest",
  });
}
