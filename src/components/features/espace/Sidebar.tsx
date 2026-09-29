"use client";

import React from "react";
import { FolderOpen, LayoutDashboard, Users } from "lucide-react";

import AppSidebar from "@/components/layouts/AppSidebar";

export default function Sidebar() {
  return (
    <AppSidebar
      roleLabel="Espace startup"
      homeHref="/espace"
      logoutTo="/connexion"
      groups={[
        {
          items: [
            { name: "Tableau de bord", href: "/espace", icon: LayoutDashboard, exact: true },
            { name: "Mentors", href: "/espace/mentors", icon: Users },
            { name: "Deal Room", href: "/espace/deal-room", icon: FolderOpen },
          ],
        },
      ]}
    />
  );
}
