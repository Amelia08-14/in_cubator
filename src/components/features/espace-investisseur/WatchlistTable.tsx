"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, CalendarDays, MoreVertical, Search, ChevronDown, FileText, CheckCircle2, Calendar, FileUp } from "lucide-react";

export default function WatchlistTable({ initialData = [] }: { initialData?: any[] }) {
  const [search, setSearch] = useState("");
  const [watchlistData, setWatchlistData] = useState(initialData);


  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document": return <FileUp size={16} className="text-[#47295C]" />;
      case "success": return <CheckCircle2 size={16} className="text-green-600" />;
      case "calendar": return <Calendar size={16} className="text-[#47295C]" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-6">
      
      {/* Filters Bar */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher une startup..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] bg-white"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 mb-1">Secteur</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]">
                <option>Tous les secteurs</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 mb-1">Stade</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]">
                <option>Tous les stades</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col pl-4 border-l border-gray-200 ml-1">
            <span className="text-[10px] font-bold text-gray-500 mb-1">Trier par</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]">
                <option>Dernière activité</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-1/4">Startup</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-1/5">Secteur & Stade</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-1/4">Progrès Levée</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-1/5">Dernière activité</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 text-center w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {watchlistData.map((startup) => (
              <tr key={startup.id} className="hover:bg-gray-50/50 transition-colors group">
                
                {/* Startup */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-white relative">
                      <Image src={startup.logo} alt={startup.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-0.5">{startup.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{startup.description}</p>
                    </div>
                  </div>
                </td>

                {/* Sector & Stage */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-[#f1edfa] text-[#47295C] rounded-md text-[10px] font-bold border border-[#eaddf7]">
                      {startup.sector}
                    </span>
                    <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold border border-orange-100">
                      {startup.stage}
                    </span>
                  </div>
                </td>

                {/* Fundraising Progress */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] font-bold text-gray-700">{startup.raisedText}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${startup.progress >= 60 ? "bg-[#47295C]" : startup.progress >= 50 ? "bg-orange-500" : "bg-yellow-500"}`} 
                          style={{ width: `${startup.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{startup.progress}%</span>
                    </div>
                  </div>
                </td>

                {/* Last Activity */}
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {getActivityIcon(startup.activity.type)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{startup.activity.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{startup.activity.time}</p>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Retirer">
                      <Heart size={16} fill="currentColor" />
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" title="Prendre RDV">
                      <CalendarDays size={14} />
                      <span className="text-[10px] font-bold hidden xl:inline">RDV</span>
                    </button>
                    <Link 
                      href={`/espace-investisseur/deal-room/${startup.name.toLowerCase()}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#47295C] hover:bg-[#5a3875] rounded-lg text-white transition-colors" 
                      title="Deal Room"
                    >
                      <span className="text-[10px] font-bold whitespace-nowrap">Deal Room</span>
                    </Link>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between text-xs font-medium text-gray-500">
        Affichage de 1 à 8 sur 8 startups
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 opacity-50 cursor-not-allowed">
            &lt;
          </button>
          <button className="w-7 h-7 rounded bg-[#47295C] text-white flex items-center justify-center font-bold shadow-sm">
            1
          </button>
          <button className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 opacity-50 cursor-not-allowed">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
