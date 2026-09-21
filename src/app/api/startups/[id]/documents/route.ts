import { proxyToApi } from "@/lib/api-proxy";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/deal-room/startups/${id}/documents`, {
    method: "POST",
    body,
    unwrap: "document",
  });
}
