import { proxyToApi } from "@/lib/api-proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; tacheId: string }> },
) {
  const { id, tacheId } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/startups/${id}/roadmap/tasks/${tacheId}`, {
    method: "PATCH",
    body,
    unwrap: "task",
  });
}
