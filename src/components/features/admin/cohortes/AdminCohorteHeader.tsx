"use client";

import React from "react";
import { Calendar, Users, TrendingUp, ChevronDown } from "lucide-react";

interface CohorteStats {
  startupsCount: number;
  progression: number;
  period: string;
}

export default function AdminCohorteHeader({ data }: { data?: CohorteStats }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 flex flex-col lg:flex-row lg:items-center">
      
      {/* Selector Section */}
      <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100">
        <label className="block text-[11px] font-bold text-gray-900 mb-2">Sélectionner la cohorte</label>
        <div className="relative">
          <select className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all cursor-pointer">
            <option>Toutes les cohortes</option>
          </select>
          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 lg:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        
        <div className="flex flex-col gap-1 sm:px-6 first:px-0">
          <span className="text-[11px] font-bold text-gray-500">Période du programme</span>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mt-1">
            <Calendar size={14} className="text-gray-400" />
            {data?.period || "Non défini"}
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-4 sm:pt-0 sm:px-6">
          <span className="text-[11px] font-bold text-gray-500">Startups dans la cohorte</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-3xl font-black text-[#47295C] leading-none">{data?.startupsCount || 0}</span>
            <Users size={20} className="text-[#eaddf7] mb-1" />
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-4 sm:pt-0 sm:px-6">
          <span className="text-[11px] font-bold text-gray-500">Taux moyen de progression</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-3xl font-black text-[#47295C] leading-none">{data?.progression || 0}%</span>
            <TrendingUp size={20} className="text-gray-400 mb-1" />
          </div>
        </div>

      </div>

    </div>
  );
}
