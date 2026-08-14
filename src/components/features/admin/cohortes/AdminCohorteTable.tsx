"use client";

import React from "react";
import { Search, Filter, MoreVertical, ExternalLink, ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

interface CohorteStartupData {
  id: string;
  name: string;
  founder: string;
  sector: string;
  sectorColor: string;
  progress: number;
  kpi: string;
  lastMeeting: string;
}

export default function AdminCohorteTable({ startups = [] }: { startups?: CohorteStartupData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Header Controls */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-900">Startups actives dans la cohorte</h2>
          <span className="px-2 py-0.5 bg-[#f1edfa] text-[#47295C] rounded-full text-[10px] font-bold border border-[#eaddf7]">
            {startups.length}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher une startup.." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shrink-0">
            <Filter size={14} />
            <span className="hidden sm:inline">Filtrer</span>
          </button>
        </div>
      </div>

      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900 w-16">#</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900">Startup & Porteur</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900">Secteur</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900">
                <div className="flex items-center gap-1 cursor-pointer">
                  Progression Globale
                  <ArrowDown size={12} className="text-gray-400" />
                </div>
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900">
                <div className="flex items-center gap-1 cursor-pointer">
                  Statut KPI
                  <ArrowDown size={12} className="text-gray-400" />
                </div>
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900">
                <div className="flex items-center gap-1 cursor-pointer">
                  Dernier RDV Mentor
                  <ArrowDown size={12} className="text-gray-400" />
                </div>
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {startups.map((startup) => (
              <tr key={startup.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-6 text-xs text-gray-500 font-medium">{startup.id}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-[#47295C]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{startup.name}</p>
                      <p className="text-[11px] text-gray-500">{startup.founder}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${startup.sectorColor}`}>
                    {startup.sector}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1.5 w-32">
                    <span className="text-[10px] font-bold text-gray-900">{startup.progress}%</span>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${startup.progress < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${startup.progress}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold ${
                    startup.kpi === 'À jour' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${startup.kpi === 'À jour' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    {startup.kpi}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-[11px] text-gray-700 whitespace-pre-line">{startup.lastMeeting}</p>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-[#47295C] rounded-lg text-[11px] font-bold hover:bg-[#f1edfa] hover:border-[#eaddf7] transition-colors shadow-sm"
                    >
                      Voir le Dashboard
                      <ExternalLink size={12} />
                    </Link>
                    <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[11px] text-gray-500 font-medium">
          Affichage de {startups.length > 0 ? 1 : 0} à {startups.length} sur {startups.length} startups
        </p>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-gray-600 transition-colors" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center bg-[#47295C] text-white font-bold text-xs shadow-sm">
            1
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-gray-600 transition-colors" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

    </div>
  );
}
