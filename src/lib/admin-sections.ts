// Sections de l'administration qu'un administrateur peut accorder à un manager.
// Les clés sont les mêmes que côté API (backend/src/config/permissions.ts).

export const ADMIN_SECTIONS = [
  { key: "crm", label: "CRM & Leads", description: "Leads, pipeline et suivi commercial", href: "/admin/crm" },
  { key: "candidatures", label: "Candidatures", description: "Examiner les dossiers et décider", href: "/admin/candidatures" },
  { key: "cohortes", label: "Cohortes", description: "Promotions et suivi des startups", href: "/admin/cohortes" },
  { key: "startups", label: "Startups", description: "Fiches, roadmaps et documents", href: "/admin/startups" },
  { key: "mentors", label: "Mentors & Experts", description: "Annuaire et gestion des mentors", href: "/admin/mentors" },
  { key: "open-innovation", label: "Open Innovation", description: "Appels à projets et mise en relation", href: "/admin/open-innovation" },
  { key: "evenements", label: "Évènements", description: "Créer les évènements et lister les inscrits", href: "/admin/evenements" },
  { key: "bibliotheque", label: "Bibliothèque CMS", description: "Ressources et contenus", href: "/admin/bibliotheque" },
] as const;

export type AdminSectionKey = (typeof ADMIN_SECTIONS)[number]["key"];

/** Gestion des utilisateurs : réservée aux administrateurs, jamais accordée à un manager. */
export type AdminAreaKey = AdminSectionKey | "utilisateurs";

export const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrateur",
  GESTIONNAIRE: "Manager",
  PORTEUR_STARTUP: "Startup",
  MENTOR_EXPERT: "Mentor / Expert",
  INVESTISSEUR: "Investisseur",
  PARTENAIRE: "Partenaire",
};

export function canOpenSection(
  user: { role: string; sections?: readonly string[] | null },
  section: AdminAreaKey,
): boolean {
  if (section === "utilisateurs") return user.role === "ADMIN";
  return user.role === "ADMIN" || Boolean(user.sections?.includes(section));
}
