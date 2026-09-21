import { proxyToApi } from "@/lib/api-proxy";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return proxyToApi(`/api/deal-room/access-requests/${id}/decision`, {
    method: "PATCH",
    body,
    unwrap: "accessRequest",
  });
}
