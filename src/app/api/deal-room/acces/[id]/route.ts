import { proxyToApi } from "@/lib/api-proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/deal-room/access-requests/${id}/decision`, {
    method: "PATCH",
    body,
    unwrap: "accessRequest",
  });
}
