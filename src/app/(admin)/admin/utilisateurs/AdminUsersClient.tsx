"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import AdminUsersStats from "@/components/features/admin/utilisateurs/AdminUsersStats";
import AdminUsersTable from "@/components/features/admin/utilisateurs/AdminUsersTable";
import AdminUsersSlideOver from "@/components/features/admin/utilisateurs/AdminUsersSlideOver";

export default function AdminUsersClient({ usersData, statsData }: { usersData: any[], statsData: any }) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez tous les comptes et les accès à la plateforme IN-CUBATOR.
          </p>
        </div>
        
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3719CA] hover:bg-[#2b10ac] text-white rounded-lg text-sm font-bold transition-colors shadow-md"
          >
            <Plus size={16} />
            Créer un utilisateur
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col">
        
        {/* Stats & Filters */}
        <AdminUsersStats data={statsData} />

        {/* Data Table */}
        <AdminUsersTable users={usersData} />

      </div>

      {/* Slide-over Form */}
      <AdminUsersSlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)} 
      />
      
    </div>
  );
}
