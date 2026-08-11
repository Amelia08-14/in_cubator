import React from "react";
import Sidebar from "@/components/features/espace/Sidebar";

export default function EspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans" data-theme="light">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
