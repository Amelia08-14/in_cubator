"use client";

import React from "react";
import { Users, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";

interface CallForProjectData {
  id: number;
  challenge: string;
  company: string;
  access: string;
  accessColor: string;
  accessIcon: React.ReactNode;
  status: string;
  statusColor: string;
  candidatures: number;
}

export default function AdminCallsForProjects({ callsForProjects = [] }: { callsForProjects?: CallForProjectData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="text-[15px] font-bold text-gray-900">2. Les Appels à Projets (Calls for Projects)</h2>
        <p className="text-[11px] text-gray-500 mt-1">
          Lancez et gérez les campagnes pour identifier les meilleures solutions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-white border-b border-gray-50">
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[25%]">Défi (Challenge)</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[15%]">Entreprise</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[15%] text-center">Mode d'accès</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[15%] text-center">Statut</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[15%] text-center">Candidatures</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[15%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {callsForProjects.map((call) => (
              <tr key={call.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="py-4 px-5">
                  <p className="text-[11px] font-medium text-gray-800 leading-tight">
                    {call.challenge}
                  </p>
                </td>
                <td className="py-4 px-5">
                  <span className="text-xs text-gray-500">{call.company}</span>
                </td>
                <td className="py-4 px-5 text-center">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${call.accessColor}`}>
                    {call.accessIcon}
                    {call.access}
                  </div>
                </td>
                <td className="py-4 px-5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${call.statusColor}`}>
                    {call.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="text-lg font-bold text-[#47295C]">{call.candidatures}</span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-medium hover:bg-gray-50 transition-colors shadow-sm">
                      Voir détails
                      <ChevronDown size={12} className="text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-50 flex justify-center mt-auto">
        <Link href="#" className="inline-block px-4 py-2 border border-gray-200 text-[#47295C] rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
          Voir tous les appels à projets
        </Link>
      </div>
    </div>
  );
}
