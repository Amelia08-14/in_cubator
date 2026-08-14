"use client";

import React from "react";
import { Building2, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function OpenInnovationSummary() {
  const challenges = [
    {
      id: 1,
      partner: "Sanofi Algérie",
      logo: "S",
      color: "bg-blue-800",
      challenge: "Solutions IA pour la pharmacovigilance",
      date: "30 juin 2024",
      startups: "18 startups",
      status: "Actif"
    },
    {
      id: 2,
      partner: "CHU Oran",
      logo: "C",
      color: "bg-teal-600",
      challenge: "Dispositifs médicaux à faible coût",
      date: "15 août 2024",
      startups: "12 startups",
      status: "Actif"
    },
    {
      id: 3,
      partner: "Groupe Kherbouche",
      logo: "G",
      color: "bg-green-700",
      challenge: "Traçabilité de la chaîne agroalimentaire",
      date: "10 juillet 2024",
      startups: "9 startups",
      status: "Actif"
    },
    {
      id: 4,
      partner: "Sonatrach",
      logo: "S",
      color: "bg-orange-600",
      challenge: "Capteurs IoT pour surveillance industrielle",
      date: "05 sept. 2024",
      startups: "6 startups",
      status: "Actif"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-[#47295C] flex items-center gap-2 mb-1">
          <Building2 size={20} className="text-[#47295C]" />
          Synthèse Open Innovation <span className="text-sm font-normal text-gray-400">(Appels à projets)</span>
        </h3>
        <p className="text-xs text-gray-500">
          Détail des challenges corporate actifs et des candidatures reçues.
        </p>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 w-[20%]">Partenaire Corporate</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 w-[35%]">Challenge / Besoin</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 w-[15%]">Date limite</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 w-[15%]">Startups candidates</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 w-[10%]">Statut</th>
              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 w-[5%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {challenges.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold ${item.color}`}>
                      {item.logo}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{item.partner}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-gray-700">
                  {item.challenge}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 font-medium">
                  {item.date}
                </td>
                <td className="px-4 py-3 text-xs font-bold text-gray-700">
                  {item.startups}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100 uppercase">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-center">
        <Link href="#" className="inline-block px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
          Voir tous les challenges
        </Link>
      </div>
    </div>
  );
}
