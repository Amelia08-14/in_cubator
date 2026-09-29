"use client";

import { apiClientV2 } from "@/lib/api-client-v2";
import type { Cohort, CohortStatus } from "./types";

export type CohortInput = {
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut?: CohortStatus;
};

export const cohortsApi = {
  async create(input: CohortInput) {
    return (await apiClientV2<{ cohort: Cohort }>("/cohorts", { method: "POST", body: JSON.stringify(input) })).cohort;
  },
  async patch(id: string, patch: Partial<CohortInput>) {
    return (await apiClientV2<{ cohort: Cohort }>(`/cohorts/${id}`, { method: "PATCH", body: JSON.stringify(patch) })).cohort;
  },
};
