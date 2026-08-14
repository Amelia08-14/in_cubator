"use client";

import React from "react";
import { MoreVertical, CheckCircle2, Clock, Calendar } from "lucide-react";
import Link from "next/link";

interface CorporateClientData {
  id: number;
  name: string;
  logo: string;
  logoBg: string;
  sector: string;
  status: string;
  statusColor: string;
  statusIcon: React.ReactNode;
  challenge: string;
  date: string;
  action: string;
  actionStyle: string;
}

export default function AdminCorporateAudits({ corporateClients = [] }: { corporateClients?: CorporateClientData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="text-[15px] font-bold text-gray-900">1. Gestion des Entreprises & Audits</h2>
        <p className="text-[11px] text-gray-500 mt-1">
          Auditez les besoins des entreprises et transformez-les en défis.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-white border-b border-gray-50">
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[20%]">Entreprise / Organisation</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[10%]">Secteur</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[15%] text-center">Statut de l'audit</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[25%]">Défi identifié</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[12%]">Dernière mise à jour</th>
              <th className="py-3 px-5 text-[10px] font-bold text-gray-500 w-[18%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {corporateClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-bold ${client.logoBg}`}>
                      {client.logo}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{client.name}</span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-100">
                    {client.sector}
                  </span>
                </td>
                <td className="py-4 px-5 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${client.statusColor}`}>
                    {client.statusIcon}
                    {client.status}
                  </div>
                </td>
                <td className="py-4 px-5">
                  <p className="text-[11px] text-gray-700 leading-tight">
                    {client.challenge}
                  </p>
                </td>
                <td className="py-4 px-5 text-[10px] text-gray-500 font-medium">
                  {client.date}
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className={`px-3 py-1.5 bg-white border rounded-lg text-[10px] font-bold transition-colors shadow-sm ${client.actionStyle}`}>
                      {client.action}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={14} />
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
          Voir toutes les entreprises
        </Link>
      </div>
    </div>
  );
}
