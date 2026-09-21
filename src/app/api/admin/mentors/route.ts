import { proxyToApi } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return proxyToApi("/api/admin/mentors", {
    searchParams: {
      q: searchParams.get("q") ?? undefined,
      actif: searchParams.get("actif") ?? undefined,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return proxyToApi("/api/admin/mentors", { method: "POST", body, unwrap: "mentor" });
}
