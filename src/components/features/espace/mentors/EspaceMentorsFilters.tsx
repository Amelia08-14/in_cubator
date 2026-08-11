"use client";

import React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

export default function EspaceMentorsFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-8 w-full">
      {/* Search Bar */}
      <div className="relative flex-1 w-full">
        <input 
          type="text" 
          placeholder="Rechercher par nom, expertise, mots-clés..." 
          className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#964594]/30 focus:border-[#964594] transition-all bg-white"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        
        {/* Secteur Dropdown */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">Secteur</span>
          <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors">
            Tous les secteurs
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Expertise Dropdown */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">Expertise</span>
          <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors">
            Toutes les expertises
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Filter Button */}
        <div className="flex flex-col gap-1 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={14} className="text-gray-500" />
            Filtres
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col gap-1 min-w-[120px] ml-auto md:ml-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">Trier par</span>
          <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors">
            Popularité
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
