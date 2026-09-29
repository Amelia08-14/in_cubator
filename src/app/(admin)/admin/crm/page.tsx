import type { Metadata } from "next";

import CrmWorkspace from "@/components/features/admin/crm/CrmWorkspace";
import { requirePageRoles } from "@/lib/page-auth";
import { adminApi } from "@/lib/server-api";
import type { CrmStats, Lead, StaffMember } from "@/lib/crm/types";

export const metadata: Metadata = { title: "CRM — Pipeline" };
export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const session = await requirePageRoles(["ADMIN", "GESTIONNAIRE"], "/admin/connexion");

  const [leadsPayload, stats, staffPayload] = await Promise.all([
    adminApi<{ leads: Lead[] }>("/api/crm/leads"),
    adminApi<CrmStats>("/api/crm/stats"),
    adminApi<{ staff: StaffMember[] }>("/api/crm/staff"),
  ]);

  return (
    <CrmWorkspace
      initialLeads={leadsPayload.leads}
      initialStats={stats}
      staff={staffPayload.staff}
      currentUserId={session.user.id}
    />
  );
}
