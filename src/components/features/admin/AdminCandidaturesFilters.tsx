"use client";

import React, { useState } from "react";
import { Search, ChevronDown, RotateCcw, Calendar } from "lucide-react";

export default function AdminCandidaturesFilters() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Recherche */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-2">Recherche</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher un projet, fondateur, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
            />
          </div>
        </div>

        {/* Statut */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-2">Statut</label>
          <div className="relative">
            <select className="block w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all bg-white">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="evaluated">Évalué</option>
              <option value="waitlist">Liste d'attente</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Type de candidature */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-2">Type de candidature</label>
          <div className="relative">
            <select className="block w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all bg-white">
              <option value="">Tous les types</option>
              <option value="general">Candidature générale</option>
              <option value="appel">Appel à projets</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Secteur */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-2">Secteur</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <select className="block w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all bg-white">
                <option value="">Tous les secteurs</option>
                <option value="sante">Santé</option>
                <option value="agritech">AgriTech</option>
                <option value="feminin">Entrepreneuriat féminin</option>
                <option value="biotech">Biotech</option>
                <option value="medtech">MedTech</option>
                <option value="blue">Blue Economy</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
            
            <button className="flex items-center justify-center h-[34px] px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap gap-2">
              <RotateCcw size={14} />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
        
        {/* Période de soumission */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-2">Période de soumission</label>
          <div className="relative cursor-pointer">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={14} className="text-gray-400" />
            </div>
            <div className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-500 bg-white">
              Sélectionner une période
            </div>
          </div>
        </div>


        
      </div>
    </div>
  );
}
