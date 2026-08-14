"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderOpen, Search, Filter, Download, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

export default function PortfolioTable({ initialData = [] }: { initialData?: any[] }) {
  const [search, setSearch] = useState("");
  const portfolio = initialData;

  const getFileIcon = (type: string) => {
    if (type === "pdf") {
      return <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px]">PDF</div>;
    }
    return <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold text-[10px]">XLSX</div>;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header & Filters */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
            <FolderOpen size={20} className="text-gray-400" />
            Mes Investissements
          </h3>
          <p className="text-sm text-gray-500">
            Détail de vos participations et suivi des performances.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher une startup..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filtrer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-[25%]">Startup</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-[15%]">Date d'investissement ↓</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-[15%]">Montant Investi</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-[15%]">Participation</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-[20%]">Dernier Rapport</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 text-center w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {portfolio.map((startup) => (
              <tr key={startup.id} className="hover:bg-gray-50/50 transition-colors group">
                
                {/* Startup */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-white relative">
                      <Image src={startup.logo} alt={startup.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-0.5">{startup.name}</h4>
                      <p className="text-[11px] text-gray-500 mb-1">{startup.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-[#f1edfa] text-[#47295C] rounded text-[9px] font-bold">
                          {startup.sector}
                        </span>
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-bold">
                          {startup.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  {startup.date}
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  {startup.amount}
                </td>

                {/* Equity */}
                <td className="px-6 py-4 text-sm font-bold text-[#47295C]">
                  {startup.equity}
                </td>

                {/* Latest Report */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getFileIcon(startup.report.type)}
                      <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{startup.report.name}</p>
                        <p className="text-[10px] text-gray-500">{startup.report.date}</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg border border-[#eaddf7] flex items-center justify-center text-[#47295C] hover:bg-[#f8f5ff] transition-colors shrink-0" title="Télécharger">
                      <Download size={14} />
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 bg-white border border-[#eaddf7] rounded-lg text-[#47295C] hover:bg-[#f8f5ff] transition-colors text-[11px] font-bold whitespace-nowrap">
                      Voir détails
                    </button>
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
        Affichage de 1 à 5 sur 8 investissements
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 opacity-50 cursor-not-allowed">
            <ChevronLeft size={14} />
          </button>
          <button className="w-7 h-7 rounded bg-[#47295C] text-white flex items-center justify-center font-bold shadow-sm">
            1
          </button>
          <button className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
