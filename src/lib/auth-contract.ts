export const APP_ROLES = [
  "PORTEUR_STARTUP",
  "MENTOR_EXPERT",
  "INVESTISSEUR",
  "PARTENAIRE",
  "GESTIONNAIRE",
  "ADMIN",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type AuthUser = {
  id: string;
  name?: string | null;
  email: string;
  role: AppRole;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
};

export const ROLE_DASHBOARD: Partial<Record<AppRole, string>> = {
  ADMIN: "/admin",
  GESTIONNAIRE: "/admin",
  PORTEUR_STARTUP: "/espace",
  MENTOR_EXPERT: "/espace-mentor",
  INVESTISSEUR: "/espace-investisseur",
};
