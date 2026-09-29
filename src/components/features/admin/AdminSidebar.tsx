"use client";

import React from "react";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  FileText,
  Handshake,
  LayoutDashboard,
  Target,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";

import AppSidebar, { type NavGroup } from "@/components/layouts/AppSidebar";
import { canOpenSection, type AdminAreaKey } from "@/lib/admin-sections";

type SidebarUser = { role: string; sections?: string[] };

// Chaque entrée n'apparaît que si le compte a accès à la section correspondante.
type GatedItem = NavGroup["items"][number] & { area?: AdminAreaKey };

export default function AdminSidebar({ newLeads = 0, user }: { newLeads?: number; user: SidebarUser }) {
  const allGroups: { title?: string; items: GatedItem[] }[] = [
    {
      title: "Pilotage",
      items: [
        { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard, exact: true },
        { name: "CRM & Leads", href: "/admin/crm", icon: Handshake, badge: newLeads || null, area: "crm" },
      ],
    },
    {
      title: "Programme",
      items: [
        { name: "Candidatures", href: "/admin/candidatures", icon: FileText, area: "candidatures" },
        { name: "Cohortes", href: "/admin/cohortes", icon: Calendar, area: "cohortes" },
        { name: "Startups", href: "/admin/startups", icon: Target, area: "startups" },
        { name: "Mentors & Experts", href: "/admin/mentors", icon: Users, area: "mentors" },
        { name: "Open Innovation", href: "/admin/open-innovation", icon: Zap, area: "open-innovation" },
      ],
    },
    {
      title: "Contenu & accès",
      items: [
        { name: "Évènements", href: "/admin/evenements", icon: CalendarDays, area: "evenements" },
        { name: "Bibliothèque CMS", href: "/admin/bibliotheque", icon: BookOpen, area: "bibliotheque" },
        { name: "Utilisateurs", href: "/admin/utilisateurs", icon: UserCircle, area: "utilisateurs" },
      ],
    },
  ];

  const groups: NavGroup[] = allGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.area || canOpenSection(user, item.area)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <AppSidebar
      groups={groups}
      roleLabel="Administration"
      homeHref="/admin"
      logoutTo="/admin/connexion"
      helpHref="/admin/support"
    />
  );
}
