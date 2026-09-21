import { proxyToApi } from "@/lib/api-proxy";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; objectifId: string }> },
) {
  const { id, objectifId } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/startups/${id}/roadmap/objectives/${objectifId}/tasks`, {
    method: "POST",
    body,
    unwrap: "task",
  });
}
