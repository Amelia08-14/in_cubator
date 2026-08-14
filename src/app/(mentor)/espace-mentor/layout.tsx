import React from "react";
import MentorSidebar from "@/components/features/espace-mentor/MentorSidebar";

export const metadata = {
  title: "Espace Mentor | Incubator",
  description: "Gérez votre activité de mentor",
};

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans" data-theme="light">
      <MentorSidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
