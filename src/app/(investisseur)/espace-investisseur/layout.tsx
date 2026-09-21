import React from "react";
import InvestorSidebar from "@/components/features/espace-investisseur/InvestorSidebar";
import { requirePageRoles } from "@/lib/page-auth";

export default async function InvestisseurLayout({ children }: { children: React.ReactNode }) {
  await requirePageRoles(["INVESTISSEUR"]);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans" data-theme="light">
      <InvestorSidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
