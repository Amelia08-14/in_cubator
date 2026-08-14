"use client";

import React from "react";
import Image from "next/image";
import { Heart, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

export default function RecommendedStartups({ initialData = [] }: { initialData?: any[] }) {
  const recommendations = initialData;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-[#47295C]" />
          <h2 className="text-lg font-bold text-gray-900">Recommandé pour vous</h2>
          <span className="bg-[#f1edfa] text-[#47295C] text-xs font-bold px-2.5 py-1 rounded-full">
            Nouveau
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs font-bold text-[#47295C] hover:text-[#5a3875] transition-colors">
          Voir tous les matches <ChevronRight size={14} />
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mb-6 font-medium">Sélection de startups qui correspondent parfaitement à vos critères et préférences.</p>

      <div className="relative">
        {/* Navigation buttons */}
        <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#47295C] z-10 hidden md:flex">
          <ChevronLeft size={20} />
        </button>
        <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#47295C] z-10 hidden md:flex">
          <ChevronRight size={20} />
        </button>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
          {recommendations.map((startup) => (
            <div 
              key={startup.id} 
              className="min-w-[320px] flex-1 bg-white rounded-xl border border-[#eaddf7] p-5 shadow-sm hover:shadow-md transition-shadow relative snap-start"
            >
              {/* Header: Badge & Save */}
              <div className="flex items-center justify-between mb-5">
                <span className="bg-[#f1edfa] text-[#47295C] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  Nouveau Match
                </span>
                <button className="text-gray-300 hover:text-[#ff4b4b] transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Startup Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 relative">
                  <Image src={startup.logo} alt={startup.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{startup.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{startup.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100">
                  {startup.sector}
                </span>
                <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold border border-orange-100">
                  {startup.stage}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Levée en cours</span>
                <span className="font-bold text-gray-900 text-base">{startup.raised}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <div className="w-2 h-2 rounded-full bg-[#47295C]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
