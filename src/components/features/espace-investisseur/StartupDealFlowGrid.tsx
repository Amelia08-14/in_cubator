"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function StartupDealFlowGrid({ initialData = [] }: { initialData?: any[] }) {
  const startups = initialData;

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Toutes les startups <span className="text-sm font-medium text-gray-500 font-normal ml-1">(48 résultats)</span>
        </h2>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Trier par</span>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]">
              <option>Pertinence</option>
              <option>Montant recherché</option>
              <option>Récent</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {startups.map((startup) => (
          <div key={startup.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            
            {/* Header info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 relative">
                <Image src={startup.logo} alt={startup.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{startup.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100">
                    {startup.sector}
                  </span>
                  <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold border border-orange-100">
                    {startup.stage}
                  </span>
                </div>
              </div>
            </div>

            {/* Pitch */}
            <p className="text-xs text-gray-600 leading-relaxed mb-5 flex-1">
              {startup.description}
            </p>

            {/* Raised Amount */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium">Levée en cours</span>
              <span className="font-bold text-gray-900 text-base">{startup.raised}</span>
            </div>

            {/* CTAs */}
            <div className="flex gap-2">
              <button className="flex flex-col items-center justify-center gap-1 w-14 h-12 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#ff4b4b] transition-colors shrink-0">
                <Heart size={16} />
                <span className="text-[9px] font-bold text-gray-500">Suivre</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1 w-[70px] h-12 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors shrink-0">
                <CalendarDays size={16} />
                <span className="text-[9px] font-bold text-gray-700">RDV</span>
              </button>
              <Link
                href={`/espace-investisseur/deal-room/${startup.name.toLowerCase()}`}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 h-12 bg-[#47295C] hover:bg-[#5a3875] rounded-lg text-white transition-colors shadow-sm"
              >
                <span className="text-[11px] font-bold">Deal Room</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 font-medium">Affichage de 1 à 12 sur 48 startups</p>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-[#47295C] text-white flex items-center justify-center text-sm font-bold shadow-sm">
            1
          </button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-50">
            4
          </button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
