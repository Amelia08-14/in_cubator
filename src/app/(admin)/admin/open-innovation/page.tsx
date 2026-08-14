"use client";

import React from "react";
import { Plus } from "lucide-react";
import AdminOpenInnovationStats from "@/components/features/admin/open-innovation/AdminOpenInnovationStats";
import AdminCorporateAudits from "@/components/features/admin/open-innovation/AdminCorporateAudits";
import AdminCallsForProjects from "@/components/features/admin/open-innovation/AdminCallsForProjects";
import AdminMatchmakingKanban from "@/components/features/admin/open-innovation/AdminMatchmakingKanban";

export default function AdminOpenInnovationPage() {
  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Open Innovation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les partenariats corporate et connectez les startups aux défis industriels.
          </p>
        </div>
        
        <div className="flex items-center shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#47295C] hover:bg-[#5a3875] text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-[#47295C]/20">
            <Plus size={14} />
            Nouvelle entreprise
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col">
        
        {/* Stats Row */}
        <AdminOpenInnovationStats />

        {/* 50/50 Split Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AdminCorporateAudits />
          <AdminCallsForProjects />
        </div>

        {/* Kanban Row */}
        <AdminMatchmakingKanban />

      </div>
    </div>
  );
}
