"use client";

import React from "react";
import { TrendingUp, ChevronDown } from "lucide-react";

interface StartupData {
  id: string;
  rank: number;
  name: string;
  sector: string;
  stage: string;
  progress: number;
  objectives: string;
  objRatio: number;
}

export default function StartupComparisonModule({ startups }: { startups: StartupData[] }) {

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "Santé": return "text-purple-600";
      case "AgriTech": return "text-green-600";
      case "Entrepreneuriat féminin": return "text-pink-500";
      case "Biotech": return "text-blue-500";
      case "MedTech": return "text-purple-600";
      default: return "text-blue-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#47295C] flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-[#47295C]" />
            Module de comparaison des startups
          </h3>
          <p className="text-xs text-gray-500">
            Classement par progression et objectifs complétés
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-gray-700 focus:outline-none">
              <option>Tous les secteurs</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-gray-700 focus:outline-none">
              <option>Par progression</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="overflow-x-auto p-4 flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-bold text-gray-500 w-[5%]">#</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-900 w-[20%]">Startup</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-900 w-[20%]">Secteur</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-900 w-[15%]">Stade</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-900 w-[20%]">Progression du projet</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-900 w-[20%]">Objectifs complétés</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {startups.map((startup) => (
              <tr key={startup.rank} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-4 py-4 text-xs font-semibold text-gray-500">
                  {startup.rank}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
                      {startup.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{startup.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs font-bold">
                  <span className={getSectorColor(startup.sector)}>{startup.sector}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold border border-green-100">
                    {startup.stage}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-900 w-8">{startup.progress}%</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#47295C] rounded-full" style={{ width: `${startup.progress}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-900 w-12">{startup.objectives}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#47295C] rounded-full" style={{ width: `${startup.objRatio}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-center">
        <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
          Voir toutes les startups
        </button>
      </div>
    </div>
  );
}
