import { proxyToApi } from "@/lib/api-proxy";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyToApi(`/api/startups/${id}/roadmap`, { unwrap: "objectives" });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  return proxyToApi(`/api/startups/${id}/roadmap/objectives`, {
    method: "POST",
    body,
    unwrap: "objective",
  });
}
