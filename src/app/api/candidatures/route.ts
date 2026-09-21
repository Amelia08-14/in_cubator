import { proxyToApi } from "@/lib/api-proxy";

export async function POST(request: Request) {
  const body = await request.json();
  const { startup, reponses } = body ?? {};
  return proxyToApi("/api/applications/me", {
    method: "POST",
    body: { startup, reponses },
    unwrap: "application",
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return proxyToApi("/api/applications", {
    searchParams: {
      statut: searchParams.get("statut") ?? undefined,
      cohorteId: searchParams.get("cohorteId") ?? undefined,
    },
  });
}
