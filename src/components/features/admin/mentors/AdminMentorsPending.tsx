"use client";

import React from "react";
import { CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface PendingMentorData {
  id: number;
  initials: string;
  name: string;
  linkedin: boolean;
  title: string;
  company: string;
  sectors: string[];
  experience: string;
  date: string;
  colors: string;
}

export default function AdminMentorsPending({ pendingMentors = [] }: { pendingMentors?: PendingMentorData[] }) {
  if (pendingMentors.length === 0) {
    return null; // Or return a nice empty state if preferred, but null is fine to hide it entirely if there's no data as requested
  }
  
  return (
    <div className="bg-white rounded-2xl border-y border-r border-orange-100 border-l-4 border-l-orange-400 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-orange-500" />
            Profils en attente d'approbation
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded-md font-bold ml-2">8 en attente</span>
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Examinez les nouvelles demandes pour rejoindre le réseau de mentors.
          </p>
        </div>
        <Link href="#" className="text-[11px] font-bold text-[#47295C] hover:underline flex items-center gap-1 shrink-0">
          Voir tous les profils en attente
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white">
              <th className="py-3 px-6 text-[11px] font-bold text-gray-500 w-[20%]">Expert</th>
              <th className="py-3 px-6 text-[11px] font-bold text-gray-500 w-[20%]">Titre / Rôle</th>
              <th className="py-3 px-6 text-[11px] font-bold text-gray-500 w-[25%]">Secteurs demandés</th>
              <th className="py-3 px-6 text-[11px] font-bold text-gray-500 w-[10%] text-center">Expérience</th>
              <th className="py-3 px-6 text-[11px] font-bold text-gray-500 w-[10%] text-center">Demandé le</th>
              <th className="py-3 px-6 text-[11px] font-bold text-gray-500 w-[15%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pendingMentors.map((mentor) => (
              <tr key={mentor.id} className="hover:bg-orange-50/20 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${mentor.colors}`}>
                      {mentor.initials}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900">{mentor.name}</span>
                      {mentor.linkedin && (
                        <div className="w-4 h-4 bg-[#0A66C2] rounded-[4px] text-white flex items-center justify-center text-[9px] font-bold leading-none cursor-pointer">
                          in
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs font-bold text-gray-900">{mentor.title}</p>
                  <p className="text-[11px] text-gray-500">{mentor.company}</p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.sectors.map((sector, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1edfa] text-[#47295C] border border-[#eaddf7]">
                        {sector}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 text-center text-xs text-gray-600 font-medium">
                  {mentor.experience}
                </td>
                <td className="py-4 px-6 text-center text-[11px] text-gray-500">
                  {mentor.date}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-green-500 text-green-600 rounded-full text-[11px] font-bold hover:bg-green-50 transition-colors shadow-sm">
                      <CheckCircle2 size={14} className="text-green-500" />
                      Approuver
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-red-500 text-red-500 rounded-full text-[11px] font-bold hover:bg-red-50 transition-colors shadow-sm">
                      <XCircle size={14} className="text-red-500" />
                      Rejeter
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
