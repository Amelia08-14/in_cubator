import React from "react";
import MentorSidebar from "@/components/features/espace-mentor/MentorSidebar";
import { requirePageRoles } from "@/lib/page-auth";

export const metadata = {
  title: "Espace Mentor | Incubator",
  description: "Gérez votre activité de mentor",
};

export default async function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRoles(["MENTOR_EXPERT"]);

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans lg:flex-row" data-theme="light">
      <MentorSidebar />
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
