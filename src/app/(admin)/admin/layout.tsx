import React from "react";
import AdminSidebar from "@/components/features/admin/AdminSidebar";
import { requirePageRoles } from "@/lib/page-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRoles(["ADMIN", "GESTIONNAIRE"], "/admin/connexion");

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans" data-theme="light">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
