import { proxyToApi } from "@/lib/api-proxy";

export async function POST(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/deal-room/access-requests", {
    method: "POST",
    body,
    unwrap: "accessRequest",
  });
}
