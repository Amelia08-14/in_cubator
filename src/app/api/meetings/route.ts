import { proxyToApi } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return proxyToApi("/api/meetings", {
    searchParams: {
      type: searchParams.get("type") ?? undefined,
      statut: searchParams.get("statut") ?? undefined,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/meetings", {
    method: "POST",
    body: { disponibiliteId: body?.disponibiliteId },
    unwrap: "meeting",
  });
}
