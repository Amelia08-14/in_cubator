import type { Metadata } from "next";

import CohortesWorkspace from "@/components/features/admin/cohortes/CohortesWorkspace";
import type { Cohort, CohortOverview } from "@/lib/cohorts/types";
import { requirePageRoles } from "@/lib/page-auth";
import { adminApi } from "@/lib/server-api";

export const metadata: Metadata = { title: "Cohortes" };
export const dynamic = "force-dynamic";

// Cohorte affichée par défaut : celle qui est en cours, sinon celle qui reçoit
// des candidatures, sinon la plus récente.
function pickDefault(cohorts: Cohort[]): Cohort | undefined {
  return (
    cohorts.find((c) => c.statut === "EN_COURS") ??
    cohorts.find((c) => c.statut === "OUVERTE_CANDIDATURES") ??
    cohorts[0]
  );
}

export default async function AdminCohortesPage({
  searchParams,
}: {
  searchParams: Promise<{ cohorte?: string }>;
}) {
  await requirePageRoles(["ADMIN", "GESTIONNAIRE"], "/admin/connexion");
  const { cohorte } = await searchParams;

  const { cohorts } = await adminApi<{ cohorts: Cohort[] }>("/api/cohorts");
  const selected = cohorts.find((c) => c.id === cohorte) ?? pickDefault(cohorts);
  const overview = selected
    ? await adminApi<CohortOverview>(`/api/cohorts/${encodeURIComponent(selected.id)}/overview`)
    : null;

  return <CohortesWorkspace cohorts={cohorts} overview={overview} />;
}
