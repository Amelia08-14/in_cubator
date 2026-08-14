"use client";

import React, { useState } from "react";
import { Search, X, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

export default function DealEngine() {
  const [search, setSearch] = useState("");
  const [ticketValue, setTicketValue] = useState(500000); // 500k default
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
      <h2 className="text-base font-bold text-[#47295C] mb-4">Moteur de recherche</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Recherche textuelle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recherche textuelle</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher une startup, un mot-clé..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
            />
          </div>
        </div>

        {/* Secteur */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Secteur</label>
          <div className="relative">
            <div className="flex flex-wrap gap-1.5 p-1.5 border border-gray-200 rounded-xl bg-white min-h-[42px] items-center">
              <div className="flex items-center gap-1 bg-[#f1edfa] text-[#47295C] px-2 py-1 rounded-md text-xs font-bold">
                HealthTech <X size={12} className="cursor-pointer hover:text-red-500" />
              </div>
              <div className="flex items-center gap-1 bg-[#f1edfa] text-[#47295C] px-2 py-1 rounded-md text-xs font-bold">
                Biotech <X size={12} className="cursor-pointer hover:text-red-500" />
              </div>
              <div className="flex items-center gap-1 bg-[#f1edfa] text-[#47295C] px-2 py-1 rounded-md text-xs font-bold">
                Agritech <X size={12} className="cursor-pointer hover:text-red-500" />
              </div>
              <input type="text" className="flex-1 min-w-[50px] outline-none text-sm text-gray-700 ml-1" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none h-[42px]">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Maturité */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Maturité</label>
          <div className="relative">
            <select className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all bg-white">
              <option value="">Toutes les maturités</option>
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Série A">Série A</option>
              <option value="Série B+">Série B+</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Ticket d'investissement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">Ticket d'investissement</label>
            <span className="text-xs font-bold text-[#47295C]">{(ticketValue / 1000)}k DZD</span>
          </div>
          <div className="pt-2 pb-1 px-1">
            <input 
              type="range" 
              min="50000" 
              max="1000000" 
              step="50000"
              value={ticketValue}
              onChange={(e) => setTicketValue(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#47295C]"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium mt-1">
            <span>50k DZD</span>
            <span>50k DZD - 1M DZD</span>
            <span>1M DZD+</span>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Localisation</label>
          <div className="relative">
            <select className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all bg-white">
              <option value="">Toutes les régions</option>
              <option value="idf">Île-de-France</option>
              <option value="paca">Provence-Alpes-Côte d'Azur</option>
              <option value="ara">Auvergne-Rhône-Alpes</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Besoin spécifique */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Besoin spécifique</label>
          <div className="relative">
            <select className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all bg-white">
              <option value="">Tous les besoins</option>
              <option value="financement">Financement</option>
              <option value="partenariat">Partenariat stratégique</option>
              <option value="recrutement">Recrutement clé</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
        <button className="flex items-center gap-2 text-sm font-bold text-[#47295C] hover:text-[#5a3875] transition-colors">
          Filtres avancés <ChevronDown size={16} />
        </button>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors px-2 py-2">
            <RotateCcw size={16} />
            Réinitialiser
          </button>
          <button className="flex items-center gap-2 bg-[#47295C] hover:bg-[#5a3875] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-[#47295C]/20 transition-all">
            <Search size={16} />
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}
