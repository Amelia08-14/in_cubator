"use client";

import React from "react";
import { FileDown } from "lucide-react";
import AdminCohorteHeader from "@/components/features/admin/cohortes/AdminCohorteHeader";
import AdminCohorteLeaderboard from "@/components/features/admin/cohortes/AdminCohorteLeaderboard";
import AdminCohorteTable from "@/components/features/admin/cohortes/AdminCohorteTable";

export default function AdminCohortesPage() {
  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Cohortes & Startups</h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivez la performance des startups incubées et intervenez si nécessaire.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eaddf7] text-[#47295C] hover:bg-[#f1edfa] rounded-lg text-xs font-bold transition-colors shadow-sm">
            <FileDown size={14} />
            Exporter le suivi (PDF/Excel)
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <AdminCohorteHeader />
        <AdminCohorteLeaderboard />
        <AdminCohorteTable />
      </div>

    </div>
  );
}
