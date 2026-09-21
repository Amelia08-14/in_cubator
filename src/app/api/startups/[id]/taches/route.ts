import { proxyToApi } from "@/lib/api-proxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return proxyToApi(`/api/startups/${id}/roadmap/tasks`, {
    method: "POST",
    body,
    unwrap: "task",
  });
}
