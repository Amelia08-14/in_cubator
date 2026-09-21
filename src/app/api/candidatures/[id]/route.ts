import { proxyToApi } from "@/lib/api-proxy";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyToApi(`/api/applications/${id}`, { unwrap: "application" });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/applications/${id}/decision`, {
    method: "PATCH",
    body,
    unwrap: "application",
  });
}
