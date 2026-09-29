// Types et libellés des cohortes (miroir de backend/src/modules/cohorts).

export type CohortStatus = "OUVERTE_CANDIDATURES" | "EN_COURS" | "TERMINEE";

export type Cohort = {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: CohortStatus;
  startupsCount: number;
  candidaturesCount: number;
};

export type CohortStartupRow = {
  id: string;
  name: string;
  founder: string;
  sector: string;
  stage: string;
  applicationStatus: string | null;
  progress: number;
  hasRoadmap: boolean;
  doneTasks: number;
  totalTasks: number;
  lastMeeting: string | null;
};

export type CohortRank = { id: string; name: string; progress: number };

export type CohortOverview = {
  cohort: Cohort;
  activeCount: number;
  pendingCount: number;
  averageProgress: number;
  top3: CohortRank[];
  bottom3: CohortRank[];
  startups: CohortStartupRow[];
};

export const COHORT_STATUS_LABEL: Record<CohortStatus, string> = {
  OUVERTE_CANDIDATURES: "Candidatures ouvertes",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};

export const COHORT_STATUS_STYLE: Record<CohortStatus, string> = {
  OUVERTE_CANDIDATURES: "bg-blue-main/10 text-blue-deep",
  EN_COURS: "bg-green-light/60 text-[#245a27]",
  TERMINEE: "bg-paper-deep text-gray-main",
};

/** Étape suivante du cycle de vie (sens unique) et ce qu'elle provoque. */
export const COHORT_NEXT: Partial<
  Record<CohortStatus, { to: CohortStatus; label: string; hint: string }>
> = {
  OUVERTE_CANDIDATURES: {
    to: "EN_COURS",
    label: "Démarrer la cohorte",
    hint: "Ferme les candidatures : plus aucune nouvelle candidature ne sera rattachée à cette cohorte.",
  },
  EN_COURS: {
    to: "TERMINEE",
    label: "Clôturer la cohorte",
    hint: "Marque la promotion comme terminée. Cette action est définitive.",
  },
};

export const STAGE_LABEL: Record<string, string> = {
  IDEE: "Idée",
  PROTOTYPE: "Prototype",
  EARLY_TRACTION: "Premières traction",
  SCALE: "Croissance",
};
