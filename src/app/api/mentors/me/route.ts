import { proxyToApi } from "@/lib/api-proxy";

export async function PATCH(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/mentors/me/profile", { method: "PATCH", body, unwrap: "mentor" });
}
