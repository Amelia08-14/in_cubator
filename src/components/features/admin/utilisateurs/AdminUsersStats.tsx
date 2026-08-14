"use client";

import React from "react";
import { Search, RotateCcw, Users, UserCheck, Clock, UserX } from "lucide-react";

interface UserStats {
  total: number;
  actifs: number;
  enAttente: number;
  desactives: number;
}

export default function AdminUsersStats({ data }: { data?: UserStats }) {
  const stats = [
    {
      title: "Total utilisateurs",
      value: data?.total || 0,
      icon: <Users size={24} className="text-[#47295C]" />,
      iconBg: "bg-[#f1edfa]"
    },
    {
      title: "Actifs",
      value: data?.actifs || 0,
      icon: <UserCheck size={24} className="text-green-600" />,
      iconBg: "bg-green-50"
    },
    {
      title: "En attente",
      value: data?.enAttente || 0,
      icon: <Clock size={24} className="text-orange-500" />,
      iconBg: "bg-orange-50"
    },
    {
      title: "Désactivés",
      value: data?.desactives || 0,
      icon: <UserX size={24} className="text-red-500" />,
      iconBg: "bg-red-50"
    }
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row items-end gap-4">
        
        <div className="flex-1 w-full relative">
          <label className="block text-[10px] font-bold text-gray-900 mb-1">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors"
            />
          </div>
        </div>

        <div className="w-full md:w-64">
          <label className="block text-[10px] font-bold text-gray-900 mb-1">Filtrer par rôle</label>
          <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors appearance-none cursor-pointer">
            <option>Tous les rôles</option>
            <option>Administrateur</option>
            <option>Startup</option>
            <option>Mentor / Expert</option>
            <option>Investisseur</option>
          </select>
        </div>

        <div className="w-full md:w-64">
          <label className="block text-[10px] font-bold text-gray-900 mb-1">Statut</label>
          <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors appearance-none cursor-pointer">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>En attente</option>
            <option>Désactivé</option>
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
          <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1 leading-none">{stat.value}</div>
              <h3 className="text-xs text-gray-500 font-medium">{stat.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
