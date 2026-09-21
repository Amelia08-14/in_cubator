import { proxyToApi } from "@/lib/api-proxy";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return proxyToApi(`/api/meetings/${id}`, { method: "PATCH", body, unwrap: "meeting" });
}
