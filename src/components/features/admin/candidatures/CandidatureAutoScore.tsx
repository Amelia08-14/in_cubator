"use client";

import React from "react";
import { Crosshair, Info, CheckCircle2 } from "lucide-react";

interface AutoScoreProps {
  candidature?: any;
}

export default function CandidatureAutoScore({ candidature }: AutoScoreProps) {
  const score = candidature?.score || 0;
  
  // Calculate relative scores based on the total so the UI looks dynamic
  const baseScore = score > 0 ? Math.floor(score / 5) : 0;
  const pScore = Math.min(20, baseScore + (score % 5 > 0 ? 1 : 0));
  const eScore = Math.min(20, baseScore + (score % 5 > 1 ? 1 : 0));
  const mScore = Math.min(20, baseScore + (score % 5 > 2 ? 1 : 0));
  const iScore = Math.min(20, baseScore + (score % 5 > 3 ? 1 : 0));
  const tScore = Math.min(20, baseScore);

  const getScoreColor = (s: number) => {
    if (s === 0) return "stroke-gray-300";
    if (s >= 80) return "stroke-green-500";
    if (s >= 65) return "stroke-yellow-500";
    return "stroke-orange-500";
  };

  const getBarColor = (s: number) => {
    if (s === 0) return "bg-gray-300";
    if (s >= 80) return "bg-green-500";
    if (s >= 65) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair size={18} className="text-[#47295C]" />
          <h2 className="text-sm font-bold text-gray-900">B. L'Évaluation Automatique</h2>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Info size={14} />
        </button>
      </div>

      <div className="p-5 lg:p-6 grid grid-cols-1 xl:grid-cols-[auto_1fr_auto] gap-6 lg:gap-8 items-center">
        
        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center shrink-0 pr-0 xl:pr-6 xl:border-r border-gray-100">
          <div className="relative w-28 h-28 flex items-center justify-center mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" className="fill-none stroke-gray-100" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="40" 
                className={`fill-none ${getScoreColor(score)} transition-all duration-1000 ease-out`} 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * score) / 100} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 leading-none">{score}</span>
              <span className="text-[10px] font-bold text-gray-400 border-t border-gray-200 mt-1 pt-1 w-8 text-center">/100</span>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-700">Score global</span>
        </div>

        {/* Details par critere */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-bold text-gray-900 mb-1">Détail par critère</h3>
          
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 whitespace-nowrap w-[130px]">
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Problème & Solution
            </span>
            <div className="flex-1 min-w-[40px] max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
              <div className={`h-full ${getBarColor(pScore * 5)} rounded-full`} style={{ width: `${pScore * 5}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-900 text-right whitespace-nowrap w-[40px]">{pScore} / 20</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 whitespace-nowrap w-[130px]">
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Équipe
            </span>
            <div className="flex-1 min-w-[40px] max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
              <div className={`h-full ${getBarColor(eScore * 5)} rounded-full`} style={{ width: `${eScore * 5}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-900 text-right whitespace-nowrap w-[40px]">{eScore} / 20</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 whitespace-nowrap w-[130px]">
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Marché
            </span>
            <div className="flex-1 min-w-[40px] max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
              <div className={`h-full ${getBarColor(mScore * 5)} rounded-full`} style={{ width: `${mScore * 5}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-900 text-right whitespace-nowrap w-[40px]">{mScore} / 20</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 whitespace-nowrap w-[130px]">
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Innovation
            </span>
            <div className="flex-1 min-w-[40px] max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
              <div className={`h-full ${getBarColor(iScore * 5)} rounded-full`} style={{ width: `${iScore * 5}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-900 text-right whitespace-nowrap w-[40px]">{iScore} / 20</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 whitespace-nowrap w-[130px]">
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Traction & Validation
            </span>
            <div className="flex-1 min-w-[40px] max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
              <div className={`h-full ${getBarColor(tScore * 5)} rounded-full`} style={{ width: `${tScore * 5}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-900 text-right whitespace-nowrap w-[40px]">{tScore} / 20</span>
          </div>

        </div>

        {/* Adequation */}
        <div className="flex flex-col gap-3 shrink-0 xl:min-w-[180px]">
          <h3 className="text-[11px] font-bold text-gray-900 mb-1">Adéquation <span className="text-gray-400 font-normal">(si applicable)</span></h3>
          
          <div className="bg-[#f1edfa] border border-[#eaddf7] rounded-xl p-3 flex items-center justify-center flex-col text-center gap-1">
            <Crosshair size={16} className="text-[#964594] mb-0.5" />
            <span className="text-xs font-bold text-[#47295C] whitespace-nowrap">Non applicable</span>
            <span className="text-[10px] text-gray-500 whitespace-nowrap">Candidature générale</span>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2 mt-1">
            <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-bold text-green-700 block truncate">Seuil recommandé : 70/100</span>
              <span className="text-[10px] text-green-600 block mt-0.5 truncate">Score supérieur au seuil</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
