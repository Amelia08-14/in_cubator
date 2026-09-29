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

export default function AdminSidebar({ newLeads = 0 }: { newLeads?: number }) {
  const groups: NavGroup[] = [
    {
      title: "Pilotage",
      items: [
        { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard, exact: true },
        { name: "CRM & Leads", href: "/admin/crm", icon: Handshake, badge: newLeads || null },
      ],
    },
    {
      title: "Programme",
      items: [
        { name: "Candidatures", href: "/admin/candidatures", icon: FileText },
        { name: "Cohortes", href: "/admin/cohortes", icon: Calendar },
        { name: "Startups", href: "/admin/startups", icon: Target },
        { name: "Mentors & Experts", href: "/admin/mentors", icon: Users },
        { name: "Open Innovation", href: "/admin/open-innovation", icon: Zap },
      ],
    },
    {
      title: "Contenu & accès",
      items: [
        { name: "Évènements", href: "/admin/evenements", icon: CalendarDays },
        { name: "Bibliothèque CMS", href: "/admin/bibliotheque", icon: BookOpen },
        { name: "Utilisateurs", href: "/admin/utilisateurs", icon: UserCircle },
      ],
    },
  ];

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
