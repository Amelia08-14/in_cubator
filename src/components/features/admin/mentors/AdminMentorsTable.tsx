"use client";

import React from "react";
import { Search, Filter, Eye, MoreVertical, Star, StarHalf, Loader2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MentorData {
  id: string;
  name: string;
  title: string;
  sectors: string[];
  hours: number;
  month: string;
  rating: number;
  reviews: number;
  status: string;
  img: string;
}

export default function AdminMentorsTable({ mentors = [] }: { mentors?: MentorData[] }) {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (mentor: MentorData) => {
    if (togglingId) return;
    setTogglingId(mentor.id);
    
    try {
      const newStatus = mentor.status === 'Actif' ? false : true;
      const res = await fetch(`/api/admin/mentors/${mentor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: newStatus })
      });
      
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors du changement de statut.");
    } finally {
      setTogglingId(null);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} className="fill-orange-400 text-orange-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} size={14} className="fill-orange-400 text-orange-400" />);
      } else {
        stars.push(<Star key={i} size={14} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mb-6">
      
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            Base de données des mentors actifs
            <span className="px-2 py-0.5 bg-[#f1edfa] text-[#47295C] text-[10px] rounded-md font-bold">{mentors.length}</span>
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Liste de tous les mentors approuvés et actifs sur la plateforme.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un mentor.." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shrink-0">
            <Filter size={14} />
            <span className="hidden sm:inline">Filtrer</span>
          </button>
          <button className="flex items-center justify-center p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[25%]">Expert</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[25%]">Secteurs</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    Heures réalisées
                    <Info size={12} className="text-gray-400" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5">(Ce mois)</span>
                </div>
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    Évaluation interne
                    <Info size={12} className="text-gray-400" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5">(Moyenne)</span>
                </div>
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[10%]">Statut</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mentors.map((mentor) => (
              <tr key={mentor.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 relative">
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                        Img
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{mentor.name}</p>
                      <p className="text-[11px] text-gray-500">{mentor.title}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.sectors.map((sector, i) => {
                      let bg = "bg-blue-50";
                      let border = "border-blue-100";
                      let text = "text-blue-700";
                      
                      if (sector.includes("Agri")) {
                        bg = "bg-green-50"; border = "border-green-100"; text = "text-green-700";
                      } else if (sector.includes("féminin") || sector.includes("Marketing")) {
                        bg = "bg-pink-50"; border = "border-pink-100"; text = "text-pink-700";
                      } else if (sector.includes("Finance")) {
                        bg = "bg-indigo-50"; border = "border-indigo-100"; text = "text-indigo-700";
                      } else if (sector.includes("IA") || sector.includes("Tech")) {
                        bg = "bg-purple-50"; border = "border-purple-100"; text = "text-purple-700";
                      } else if (sector.includes("Data") || sector.includes("santé")) {
                        bg = "bg-orange-50"; border = "border-orange-100"; text = "text-orange-700";
                      }
                      
                      return (
                        <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bg} ${border} ${text}`}>
                          {sector}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">{mentor.hours} h</span>
                    <span className="text-[10px] text-gray-500">({mentor.month})</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-0.5">
                      {renderStars(mentor.rating)}
                    </div>
                    <span className="text-[10px] text-gray-500">
                      <strong className="text-gray-700 font-bold">{mentor.rating} / 5</strong> ({mentor.reviews} avis)
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                    mentor.status === 'Actif' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${mentor.status === 'Actif' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    {mentor.status}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/mentors/${mentor.id}`} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-[#47295C] rounded-lg text-xs font-bold hover:bg-[#f1edfa] hover:border-[#eaddf7] transition-colors shadow-sm whitespace-nowrap">
                      <Eye size={14} className="text-gray-400 shrink-0" />
                      <span>Voir profil</span>
                    </Link>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => handleToggleStatus(mentor)}
                      disabled={togglingId === mentor.id}
                      className={`w-9 h-5 rounded-full relative transition-colors shrink-0 disabled:opacity-50 ${mentor.status === 'Actif' ? 'bg-[#47295C]' : 'bg-gray-200'}`}
                    >
                      {togglingId === mentor.id ? (
                        <Loader2 size={12} className="absolute top-1 left-1/2 -translate-x-1/2 animate-spin text-white" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${mentor.status === 'Actif' ? 'left-[18px]' : 'left-0.5'}`}></div>
                      )}
                    </button>

                    <button className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[11px] text-gray-500 font-medium">
          Affichage de {mentors.length > 0 ? 1 : 0} à {mentors.length} sur {mentors.length} mentors
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
          
          <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium">5 / page</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
