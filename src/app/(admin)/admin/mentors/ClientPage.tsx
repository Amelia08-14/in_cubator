"use client";

import React, { useState } from "react";
import { Plus, Download } from "lucide-react";
import AdminMentorsPending from "@/components/features/admin/mentors/AdminMentorsPending";
import AdminMentorsTable from "@/components/features/admin/mentors/AdminMentorsTable";
import AdminMentorsSlideOver from "@/components/features/admin/mentors/AdminMentorsSlideOver";

export default function ClientPage({ mentors }: { mentors: any[] }) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ACTIFS' | 'ATTENTE' | 'INACTIFS'>('ACTIFS');

  const filteredMentors = mentors.filter(m => {
    if (activeTab === 'ACTIFS') return m.status === 'Actif';
    if (activeTab === 'INACTIFS') return m.status === 'Inactif';
    // For ATTENTE, we would check another flag, assuming none for now
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      
      {/* Top Header Section */}
      <header className="bg-white px-8 pt-6 border-b border-gray-200 flex flex-col gap-6 shadow-sm sticky top-0 z-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Mentors & Experts</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez votre réseau d'experts, approuvez les nouveaux profils et suivez leur activité.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsSlideOverOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#47295C] hover:bg-[#5a3875] text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-[#47295C]/20"
            >
              <Plus size={14} />
              Ajouter un Mentor
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eaddf7] text-[#47295C] hover:bg-[#f1edfa] rounded-lg text-xs font-bold transition-colors shadow-sm">
              <Download size={14} className="rotate-180" />
              Importer (CSV/Excel)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('ACTIFS')}
            className={`text-sm font-bold pb-3 px-1 transition-colors ${activeTab === 'ACTIFS' ? 'text-[#47295C] border-b-[3px] border-[#47295C]' : 'text-gray-500 hover:text-gray-900 border-b-[3px] border-transparent'}`}
          >
            Mentors Actifs
          </button>
          <button 
            onClick={() => setActiveTab('ATTENTE')}
            className={`text-sm font-bold pb-3 px-1 flex items-center gap-2 transition-colors ${activeTab === 'ATTENTE' ? 'text-[#47295C] border-b-[3px] border-[#47295C]' : 'text-gray-500 hover:text-gray-900 border-b-[3px] border-transparent'}`}
          >
            Profils en attente
            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] leading-none">
              0
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('INACTIFS')}
            className={`text-sm font-bold pb-3 px-1 transition-colors ${activeTab === 'INACTIFS' ? 'text-[#47295C] border-b-[3px] border-[#47295C]' : 'text-gray-500 hover:text-gray-900 border-b-[3px] border-transparent'}`}
          >
            Mentors Inactifs
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
        {activeTab === 'ATTENTE' && <AdminMentorsPending />}
        <AdminMentorsTable mentors={filteredMentors} />
      </div>

      <AdminMentorsSlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)} 
      />
    </div>
  );
}
