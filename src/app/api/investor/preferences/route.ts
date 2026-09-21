import { proxyToApi } from "@/lib/api-proxy";

export async function GET() {
  return proxyToApi("/api/investors/me/preferences", { unwrap: "preferences" });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/investors/me/preferences", {
    method: "PUT",
    body,
    unwrap: "preferences",
  });
}
