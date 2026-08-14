import React from "react";
import InvestorSidebar from "@/components/features/espace-investisseur/InvestorSidebar";

export default function InvestisseurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans" data-theme="light">
      <InvestorSidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
