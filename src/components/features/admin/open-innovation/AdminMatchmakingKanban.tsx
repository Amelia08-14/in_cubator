"use client";

import React from "react";
import { Filter, MoreVertical, BrainCircuit, HeartPulse, Leaf, Stethoscope, Droplet } from "lucide-react";
import Link from "next/link";

interface KanbanStartup {
  id: number;
  startup: string;
  icon: React.ReactNode;
  iconBg: string;
  defi?: string;
  client?: string;
  date: string;
  score?: number;
  scoreColor?: string;
  status?: string;
  statusColor?: string;
}

interface KanbanData {
  evaluation: KanbanStartup[];
  selection: KanbanStartup[];
  pilote: KanbanStartup[];
}

export default function AdminMatchmakingKanban({ 
  kanbanData = { evaluation: [], selection: [], pilote: [] } 
}: { 
  kanbanData?: KanbanData 
}) {
  return (
    <div className="flex flex-col mb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">3. Pipeline de Mise en Relation <span className="font-normal text-gray-500">(Matchmaking)</span></h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Suivez le parcours des startups à travers les étapes de sélection jusqu'au pilote.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm shrink-0">
          <Filter size={14} />
          Filtrer par défi
          <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Évaluation */}
        <div className="bg-[#f8f9fa] border border-[#eaddf7] rounded-xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#47295C]"></div>
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <h3 className="text-sm font-bold text-[#47295C] flex items-center gap-2">
              Évaluation
              <span className="w-5 h-5 rounded-full bg-[#f1edfa] text-[#47295C] flex items-center justify-center text-[10px] leading-none font-bold">
                12
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Analyse des candidatures (évaluation intelligente)</p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-white">
            {kanbanData.evaluation.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.startup}</h4>
                      <p className="text-[10px] text-gray-600 line-clamp-1 mt-0.5">Défi: {item.defi}</p>
                    </div>
                  </div>
                  <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.scoreColor}`}>
                    {item.score}/100
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                  <span className="text-[9px] text-gray-400">{item.date}</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 text-center mt-auto">
            <button className="text-[11px] font-bold text-[#47295C] hover:underline">Voir toutes (12)</button>
          </div>
          
          {/* Arrow pointing right */}
          <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>

        {/* Column 2: Sélection */}
        <div className="bg-[#f8f9fa] border border-orange-200 rounded-xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Sélection
              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] leading-none font-bold">
                6
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Startups sélectionnées pour pitcher</p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-white">
            {kanbanData.selection.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900">{item.startup}</h4>
                    <p className="text-[10px] text-gray-600 line-clamp-1 mt-0.5">Défi: {item.defi}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                  <span className="text-[9px] text-gray-400">{item.date}</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 text-center mt-auto">
            <button className="text-[11px] font-bold text-[#47295C] hover:underline">Voir toutes (6)</button>
          </div>
          
          {/* Arrow pointing right */}
          <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>

        {/* Column 3: Phase Pilote */}
        <div className="bg-[#f8f9fa] border border-green-200 rounded-xl flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Phase Pilote
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] leading-none font-bold">
                5
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Startups en phase de déploiement avec le client</p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-white">
            {kanbanData.pilote.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.startup}</h4>
                      <p className="text-[10px] text-gray-600 mt-0.5">Client: {item.client}</p>
                    </div>
                  </div>
                  <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.statusColor}`}>
                    {item.status}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                  <span className="text-[9px] text-gray-400">{item.date}</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 text-center mt-auto">
            <button className="text-[11px] font-bold text-[#47295C] hover:underline">Voir toutes (5)</button>
          </div>
        </div>

      </div>
    </div>
  );
}
