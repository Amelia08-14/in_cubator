"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import AdminLibraryStats from "@/components/features/admin/bibliotheque/AdminLibraryStats";
import AdminLibraryTable from "@/components/features/admin/bibliotheque/AdminLibraryTable";
import AdminLibrarySlideOver from "@/components/features/admin/bibliotheque/AdminLibrarySlideOver";

export default function AdminLibraryPage() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la Bibliothèque</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ajoutez, organisez et gérez les ressources mises à disposition des startups incubées.
          </p>
        </div>
        
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3719CA] hover:bg-[#2b10ac] text-white rounded-lg text-xs font-bold transition-colors shadow-md"
          >
            <Plus size={14} />
            Ajouter une ressource
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col">
        
        {/* Stats & Filters */}
        <AdminLibraryStats />

        {/* Data Table */}
        <AdminLibraryTable />

      </div>

      {/* Slide-over Form */}
      <AdminLibrarySlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)} 
      />
      
    </div>
  );
}
