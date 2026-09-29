import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePageRoles } from "@/lib/page-auth";
import Sidebar from "@/components/features/espace/Sidebar";

import ServerHeader from "@/components/features/espace/ServerHeader";


export default async function EspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requirePageRoles(["PORTEUR_STARTUP"]);

  // Gatekeeper: Check for StartupProfile and Candidature status
  const profile = await prisma.startupProfile.findUnique({
    where: { userId: session.user.id },
    include: { candidature: true }
  });

  // 1. No profile => Not even applied yet => Redirect to /
  if (!profile) {
    redirect("/");
  }

  // 2. Applied but not ACCEPTEE => Redirect to waiting page
  if (!profile.candidature || profile.candidature.statut !== "ACCEPTEE") {
    redirect("/candidature/attente");
  }

  // 3. Allowed to enter the dashboard
  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans lg:flex-row" data-theme="light">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <ServerHeader />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
