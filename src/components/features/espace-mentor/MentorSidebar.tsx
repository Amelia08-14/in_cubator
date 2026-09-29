"use client";

import React from "react";
import { CalendarDays, LayoutDashboard, Settings } from "lucide-react";

import AppSidebar from "@/components/layouts/AppSidebar";

export default function MentorSidebar() {
  return (
    <AppSidebar
      roleLabel="Espace mentor"
      homeHref="/espace-mentor"
      logoutTo="/connexion"
      groups={[
        {
          items: [
            { name: "Tableau de bord", href: "/espace-mentor", icon: LayoutDashboard, exact: true },
            { name: "Mes disponibilités", href: "/espace-mentor/disponibilites", icon: CalendarDays },
            { name: "Paramètres", href: "/espace-mentor/parametres", icon: Settings },
          ],
        },
      ]}
    />
  );
}
