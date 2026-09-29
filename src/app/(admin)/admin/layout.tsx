import React from "react";
import AdminSidebar from "@/components/features/admin/AdminSidebar";
import { requirePageRoles } from "@/lib/page-auth";
import { adminApi } from "@/lib/server-api";
import type { CrmStats } from "@/lib/crm/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRoles(["ADMIN", "GESTIONNAIRE"], "/admin/connexion");

  // Badge du CRM : leads encore à l'étape « Nouveau ». Une indisponibilité de
  // l'API ne doit jamais empêcher d'afficher le reste de l'administration.
  const newLeads = await adminApi<CrmStats>("/api/crm/stats")
    .then((stats) => stats.byStage.find((s) => s.stage === "NOUVEAU")?.count ?? 0)
    .catch(() => 0);

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans lg:flex-row" data-theme="light">
      <AdminSidebar newLeads={newLeads} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
