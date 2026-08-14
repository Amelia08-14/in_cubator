import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/features/espace/Sidebar";

import ServerHeader from "@/components/features/espace/ServerHeader";


export default async function EspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/connexion");
  }

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
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans" data-theme="light">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden flex flex-col">
        <ServerHeader />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
