// Types et constantes partagés du CRM (côté interface).
// Les valeurs miroirs de l'API : backend/src/modules/crm/crm.schemas.ts.

export const LEAD_STAGES = [
  "NOUVEAU",
  "DIAGNOSTIC",
  "ACCOMPAGNEMENT",
  "TEST_TERRAIN",
  "RESEAU",
  "FORMATIONS",
  "LANCEMENT",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export type LeadStatus = "OUVERT" | "GAGNE" | "PERDU";
export type LeadType = "STARTUP" | "INVESTISSEUR" | "PARTENAIRE" | "MENTOR" | "DIASPORA" | "AUTRE";
export type LeadSource =
  | "SITE_WEB"
  | "CANDIDATURE"
  | "EVENEMENT"
  | "RECOMMANDATION"
  | "PARTENAIRE"
  | "RESEAUX_SOCIAUX"
  | "TELEPHONE"
  | "IN_NETWORK"
  | "AUTRE";
export type ActivityType = "NOTE" | "APPEL" | "EMAIL" | "REUNION" | "TACHE" | "SYSTEME";

export type StaffMember = { id: string; email: string };

export type Lead = {
  id: string;
  reference: string;
  title: string;
  contactName: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  type: LeadType;
  source: LeadSource;
  stage: LeadStage;
  status: LeadStatus;
  priority: number;
  score: number | null;
  message: string | null;
  lostReason: string | null;
  nextActivityAt: string | null;
  candidatureId: string | null;
  assignedToId: string | null;
  assignedTo: StaffMember | null;
  stageChangedAt: string;
  wonAt: string | null;
  lostAt: string | null;
  createdAt: string;
  updatedAt: string;
  probability: number;
  activityCount: number;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  authorId: string | null;
  author: StaffMember | null;
  type: ActivityType;
  content: string;
  dueAt: string | null;
  doneAt: string | null;
  createdAt: string;
};

export type LeadDetailData = Lead & { activities: LeadActivity[] };

export type CrmStats = {
  totals: { open: number; won: number; lost: number; all: number };
  created30: number;
  created60: number;
  conversionRate: number | null;
  weightedOpen: number;
  avgDaysToWin: number | null;
  overdueActivities: number;
  byStage: { stage: LeadStage; label: string; probability: number; count: number }[];
  bySource: { source: LeadSource; count: number }[];
  byType: { type: LeadType; count: number }[];
  weekly: { weekStart: string; count: number }[];
  upcoming: (LeadActivity & { lead: { id: string; title: string; reference: string } })[];
};

export const STAGE_META: Record<
  LeadStage,
  { label: string; short: string; probability: number; color: string }
> = {
  NOUVEAU: { label: "Nouveau", short: "Nouveau", probability: 10, color: "#1f5aa6" },
  DIAGNOSTIC: { label: "Diagnostic & structuration", short: "Diagnostic", probability: 20, color: "#3d4fa0" },
  ACCOMPAGNEMENT: { label: "Accompagnement & accélération", short: "Accompagnement", probability: 35, color: "#5a3a7c" },
  TEST_TERRAIN: { label: "Test & validation terrain", short: "Test terrain", probability: 50, color: "#7a3f8a" },
  RESEAU: { label: "Réseau & visibilité", short: "Réseau", probability: 65, color: "#964594" },
  FORMATIONS: { label: "Formations & ateliers", short: "Formations", probability: 80, color: "#b8476a" },
  LANCEMENT: { label: "Lancement & mise en marché", short: "Lancement", probability: 90, color: "#d44835" },
};

export const TYPE_LABEL: Record<LeadType, string> = {
  STARTUP: "Startup",
  INVESTISSEUR: "Investisseur",
  PARTENAIRE: "Partenaire",
  MENTOR: "Mentor",
  DIASPORA: "Diaspora",
  AUTRE: "Autre",
};

export const SOURCE_LABEL: Record<LeadSource, string> = {
  SITE_WEB: "Site web",
  CANDIDATURE: "Candidature",
  EVENEMENT: "Événement",
  RECOMMANDATION: "Recommandation",
  PARTENAIRE: "Partenaire",
  RESEAUX_SOCIAUX: "Réseaux sociaux",
  TELEPHONE: "Téléphone",
  IN_NETWORK: "IN NETWORK",
  AUTRE: "Autre",
};

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  NOTE: "Note",
  APPEL: "Appel",
  EMAIL: "Email",
  REUNION: "Rendez-vous",
  TACHE: "Tâche",
  SYSTEME: "Système",
};

export const STATUS_LABEL: Record<LeadStatus, string> = {
  OUVERT: "Ouvert",
  GAGNE: "Gagné",
  PERDU: "Perdu",
};

export function staffName(member: StaffMember | null | undefined): string {
  if (!member) return "Non assigné";
  const local = member.email.split("@")[0] ?? member.email;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function staffInitial(member: StaffMember | null | undefined): string {
  return member ? staffName(member).charAt(0) : "?";
}

export type ActivityUrgency = "overdue" | "today" | "soon" | "none";

export function urgencyOf(iso: string | null): ActivityUrgency {
  if (!iso) return "none";
  const due = new Date(iso);
  const now = new Date();
  if (due.getTime() < now.getTime()) return "overdue";
  const sameDay = due.toDateString() === now.toDateString();
  return sameDay ? "today" : "soon";
}

export function formatDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function relativeDays(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days} j`;
}
