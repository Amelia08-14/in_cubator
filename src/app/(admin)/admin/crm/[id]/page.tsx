import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LeadDetail from "@/components/features/admin/crm/LeadDetail";
import { requirePageRoles } from "@/lib/page-auth";
import { adminApi, ApiError } from "@/lib/server-api";
import type { LeadDetailData, StaffMember } from "@/lib/crm/types";

export const metadata: Metadata = { title: "Fiche lead — CRM" };
export const dynamic = "force-dynamic";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requirePageRoles(["ADMIN", "GESTIONNAIRE"], "/admin/connexion");

  let data: { lead: LeadDetailData; staff: StaffMember[] };
  try {
    const [{ lead }, { staff }] = await Promise.all([
      adminApi<{ lead: LeadDetailData }>(`/api/crm/leads/${encodeURIComponent(id)}`),
      adminApi<{ staff: StaffMember[] }>("/api/crm/staff"),
    ]);
    data = { lead, staff };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return <LeadDetail initial={data.lead} staff={data.staff} isAdmin={session.user.role === "ADMIN"} />;
}
