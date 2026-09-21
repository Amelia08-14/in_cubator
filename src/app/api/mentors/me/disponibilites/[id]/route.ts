import { proxyToApi } from "@/lib/api-proxy";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyToApi(`/api/mentors/me/disponibilites/${id}`, { method: "DELETE" });
}
