import React from "react";
import InvestorSidebar from "@/components/features/espace-investisseur/InvestorSidebar";
import { requirePageRoles } from "@/lib/page-auth";

export default async function InvestisseurLayout({ children }: { children: React.ReactNode }) {
  await requirePageRoles(["INVESTISSEUR"]);

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans lg:flex-row" data-theme="light">
      <InvestorSidebar />
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
