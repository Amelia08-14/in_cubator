import { proxyToApi } from "@/lib/api-proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/deal-room/startups/${id}/documents/${docId}`, {
    method: "PATCH",
    body,
    unwrap: "document",
  });
}
