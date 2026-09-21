import { proxyToApi } from "@/lib/api-proxy";

export async function POST(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/mentors/me/disponibilites", {
    method: "POST",
    body,
    unwrap: "disponibilite",
  });
}
