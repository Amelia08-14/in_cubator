"use client";

import React from "react";
import { Search, RotateCcw, FileText, Folder, Users, Lock } from "lucide-react";

interface LibraryStats {
  total: number;
  categories: number;
  public: number;
  targeted: number;
}

export default function AdminLibraryStats({ data }: { data?: LibraryStats }) {
  const stats = [
    {
      title: "Ressources totales",
      value: data?.total || 0,
      subtitle: "+ 0 ce mois-ci",
      icon: <FileText size={24} className="text-blue-500" />,
      iconBg: "bg-blue-50",
      borderColor: "border-gray-200"
    },
    {
      title: "Catégories",
      value: data?.categories || 0,
      subtitle: "Organisées",
      icon: <Folder size={24} className="text-[#47295C]" />,
      iconBg: "bg-[#f1edfa]",
      borderColor: "border-gray-200"
    },
    {
      title: "Ressources publiques",
      value: data?.public || 0,
      subtitle: "Visibles par tous",
      icon: <Users size={24} className="text-green-500" />,
      iconBg: "bg-green-50",
      borderColor: "border-gray-200"
    },
    {
      title: "Ressources ciblées",
      value: data?.targeted || 0,
      subtitle: "Par cohortes",
      icon: <Lock size={24} className="text-pink-500" />,
      iconBg: "bg-pink-50",
      borderColor: "border-gray-200"
    }
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row items-end gap-4">
        
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un document..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors"
          />
        </div>

        <div className="w-full md:w-64">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Catégorie</label>
          <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors appearance-none cursor-pointer">
            <option>Toutes les catégories</option>
            <option>Modèles / Templates</option>
            <option>Finance</option>
            <option>Juridique</option>
            <option>Stratégie</option>
            <option>Marketing</option>
          </select>
        </div>

        <div className="w-full md:w-64">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">Audience (Visibilité)</label>
          <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors appearance-none cursor-pointer">
            <option>Toutes les audiences</option>
            <option>Toutes les startups</option>
            <option>Par cohorte spécifique</option>
          </select>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shrink-0 h-[38px]">
          <RotateCcw size={14} />
          Réinitialiser
        </button>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-500 mb-0.5">{stat.title}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1 leading-none">{stat.value}</div>
              <p className="text-[10px] text-gray-400">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
