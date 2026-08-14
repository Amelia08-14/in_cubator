"use client";

import React from "react";
import { Eye, FolderOpen, MoreVertical, ArrowDown, ChevronDown } from "lucide-react";
import Link from "next/link";

interface CandidatureData {
  id: string;
  name: string;
  email: string;
  founder: string;
  founderEmail: string;
  type: string;
  challenge: string;
  sector: string;
  score: number;
  date: string;
  time: string;
  status: string;
}

export default function AdminCandidaturesTable({ candidatures = [] }: { candidatures?: CandidatureData[] }) {

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "En attente":
        return <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md text-[10px] font-bold border border-yellow-100">En attente</span>;
      case "Évalué":
        return <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100">Évalué</span>;
      case "Liste d'attente":
        return <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold border border-orange-100">Liste d'attente</span>;
      case "Accepté":
        return <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold border border-green-100">Accepté</span>;
      case "Refusé":
        return <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-[10px] font-bold border border-red-100">Refusé</span>;
      default:
        return null;
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "Santé": return "text-purple-600";
      case "AgriTech": return "text-green-600";
      case "Entrepreneuriat féminin": return "text-pink-500";
      case "Biotech": return "text-blue-500";
      case "MedTech": return "text-purple-600";
      case "Blue Economy": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 65) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mb-8">
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[18%]">Nom du Projet</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[16%]">Porteur de Projet</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[18%]">Type / Défi</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[10%]">Secteur</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[14%]">
                <div className="flex items-center gap-1.5">
                  Score Automatique
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-200 flex items-center justify-center text-[8px] text-gray-400 font-bold">?</span>
                </div>
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[10%]">
                <div className="flex items-center gap-1">
                  Date de soumission
                  <ArrowDown size={12} className="text-[#47295C]" />
                </div>
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[8%]">Statut</th>
              <th className="px-5 py-4 text-xs font-bold text-gray-900 w-[6%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {candidatures.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                
                {/* Nom du Projet */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                      {app.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{app.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{app.email}</p>
                    </div>
                  </div>
                </td>

                {/* Porteur */}
                <td className="px-5 py-4">
                  <p className="text-xs font-bold text-gray-700 truncate">{app.founder}</p>
                  <p className="text-[10px] text-gray-500 truncate">{app.founderEmail}</p>
                </td>

                {/* Type / Défi */}
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${app.type === 'Appel à projets' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-[#f1edfa] border-[#eaddf7] text-[#47295C]'}`}>
                    {app.type}
                  </span>
                  {app.challenge && (
                    <p className="text-[10px] text-gray-500 truncate mt-1.5">{app.challenge}</p>
                  )}
                </td>

                {/* Secteur */}
                <td className="px-5 py-4 text-[11px] font-bold">
                  <span className={getSectorColor(app.sector)}>{app.sector}</span>
                </td>

                {/* Score Automatique */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold ${getScoreColor(app.score).replace('bg-', 'text-')}`}>{app.score}</span>
                    <span className="text-[10px] font-medium text-gray-400">/ 100</span>
                  </div>
                  <div className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${getScoreColor(app.score)} rounded-full`} style={{ width: `${app.score}%` }}></div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <p className="text-xs font-medium text-gray-700">{app.date}</p>
                  <p className="text-[10px] text-gray-400">{app.time}</p>
                </td>

                {/* Statut */}
                <td className="px-5 py-4">
                  {getStatusBadge(app.status)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {app.status === "En attente" ? (
                      <Link 
                        href={`/admin/candidatures/${app.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#eaddf7] text-[#47295C] rounded-lg text-[10px] font-bold hover:bg-[#f1edfa] transition-colors"
                      >
                        <Eye size={12} />
                        Évaluer
                      </Link>
                    ) : (
                      <Link 
                        href={`/admin/candidatures/${app.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-50 transition-colors"
                      >
                        <FolderOpen size={12} />
                        Ouvrir le dossier
                      </Link>
                    )}
                    
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <p className="text-[11px] text-gray-500 font-medium">Affichage de 1 à 8 sur 124 candidatures</p>
        
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronDown size={14} className="rotate-90" />
          </button>
          
          <button className="w-7 h-7 rounded flex items-center justify-center bg-[#47295C] text-white font-bold text-xs shadow-sm">1</button>
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-colors">2</button>
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-colors">3</button>
          <span className="text-xs text-gray-400 px-1">...</span>
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-colors">16</button>
          
          <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronDown size={14} className="-rotate-90" />
          </button>

          <div className="ml-4 flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium">8 / page</span>
            <ChevronDown size={12} className="text-gray-400" />
          </div>
        </div>
      </div>

    </div>
  );
}
