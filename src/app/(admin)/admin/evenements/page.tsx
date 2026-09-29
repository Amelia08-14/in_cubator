import type { Metadata } from "next";

import EventsWorkspace from "@/components/features/admin/evenements/EventsWorkspace";
import type { EventItem } from "@/lib/events/types";
import { requirePageRoles } from "@/lib/page-auth";
import { adminApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Évènements" };
export const dynamic = "force-dynamic";

export default async function AdminEvenementsPage() {
  await requirePageRoles(["ADMIN", "GESTIONNAIRE"], "/admin/connexion");
  const { events } = await adminApi<{ events: EventItem[] }>("/api/admin/events");

  return <EventsWorkspace events={events} />;
}
