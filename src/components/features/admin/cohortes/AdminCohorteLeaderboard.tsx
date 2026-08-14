"use client";

import React from "react";
import { Trophy, AlertTriangle } from "lucide-react";

interface LeaderboardStartup {
  name: string;
  progress: number;
}

export default function AdminCohorteLeaderboard({ 
  top3 = [], 
  bottom3 = [],
  averageProgress = 0
}: { 
  top3?: LeaderboardStartup[], 
  bottom3?: LeaderboardStartup[],
  averageProgress?: number 
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">Module de comparaison – Progression des startups</h2>
        <p className="text-[11px] text-gray-500 mt-1">Classement basé sur le taux d'objectifs complétés dans la roadmap actuel.</p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 xl:gap-12 items-center">
        
        {/* Top 3 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-green-600" />
            <h3 className="text-[11px] font-bold text-green-700">Top 3 – Meilleures progressions</h3>
          </div>

          {top3.length === 0 ? (
            <p className="text-xs text-gray-500 italic">Données insuffisantes.</p>
          ) : (
            top3.map((startup, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">{idx + 1}</div>
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-xs font-bold text-gray-900 w-24 truncate">{startup.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${startup.progress}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-900 w-8 text-right">{startup.progress}%</span>
              </div>
            ))
          )}
        </div>

        {/* Center Circular Progress */}
        <div className="flex flex-col items-center justify-center lg:px-8 py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-gray-100 shrink-0">
          <div className="relative w-28 h-28 flex items-center justify-center mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" className="fill-none stroke-gray-100" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="40" 
                className="fill-none stroke-[#47295C] transition-all duration-1000 ease-out" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * averageProgress) / 100} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900 leading-none">{averageProgress}%</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-gray-600">Progression</span>
          <span className="text-[10px] text-gray-400">moyenne</span>
        </div>

        {/* Bottom 3 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-[11px] font-bold text-red-600">Bottom 3 – En retard</h3>
          </div>

          {bottom3.length === 0 ? (
            <p className="text-xs text-gray-500 italic">Données insuffisantes.</p>
          ) : (
            bottom3.map((startup, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 10}</div>
                <div className="w-6 h-6 rounded-md bg-red-50 text-red-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-xs font-bold text-gray-900 w-24 truncate">{startup.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${startup.progress}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-900 w-8 text-right">{startup.progress}%</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
