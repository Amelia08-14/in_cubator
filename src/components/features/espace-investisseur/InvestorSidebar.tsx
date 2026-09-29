"use client";

import React from "react";
import { FolderOpen, Heart, PieChart, Search, Settings } from "lucide-react";

import AppSidebar from "@/components/layouts/AppSidebar";

export default function InvestorSidebar() {
  return (
    <AppSidebar
      roleLabel="Espace investisseur"
      homeHref="/espace-investisseur"
      logoutTo="/connexion"
      helpHref="/espace-investisseur/support"
      groups={[
        {
          items: [
            { name: "Explorer", href: "/espace-investisseur", icon: Search, exact: true },
            { name: "Ma watchlist", href: "/espace-investisseur/watchlist", icon: Heart },
            { name: "Deal Room", href: "/espace-investisseur/deal-room", icon: FolderOpen },
            { name: "Portefeuille", href: "/espace-investisseur/portefeuille", icon: PieChart },
            { name: "Préférences", href: "/espace-investisseur/preferences", icon: Settings },
          ],
        },
      ]}
    />
  );
}
