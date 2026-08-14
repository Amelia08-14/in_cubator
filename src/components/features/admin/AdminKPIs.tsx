import React from "react";
import { FileText, Users, Coins, UserCircle, Info } from "lucide-react";

interface AdminKPIsProps {
  candidaturesCount: number;
  startupsCount: number;
  mentorsCount: number;
  fondsLeves?: string;
}

export default function AdminKPIs({ 
  candidaturesCount, 
  startupsCount, 
  mentorsCount,
  fondsLeves = "0 DZD"
}: AdminKPIsProps) {
  const kpis = [
    {
      id: 1,
      title: "Candidatures en attente",
      value: candidaturesCount.toString(),
      subtitle: "Mise à jour en direct",
      icon: <FileText size={20} className="text-[#47295C]" />,
      iconBg: "bg-[#f1edfa]",
      borderColor: "border-b-[#47295C]",
    },
    {
      id: 2,
      title: "Startups Actives",
      value: startupsCount.toString(),
      subtitle: "Sur la plateforme",
      icon: <Users size={20} className="text-green-600" />,
      iconBg: "bg-green-50",
      borderColor: "border-b-green-600",
    },
    {
      id: 3,
      title: "Fonds Levés (Global)",
      value: fondsLeves,
      subtitle: "Estimation basée sur les données",
      icon: <Coins size={20} className="text-blue-600" />,
      iconBg: "bg-blue-50",
      borderColor: "border-b-blue-600",
    },
    {
      id: 4,
      title: "Mentors Actifs",
      value: mentorsCount.toString(),
      subtitle: "Disponibles pour sessions",
      icon: <UserCircle size={20} className="text-orange-500" />,
      iconBg: "bg-orange-50",
      borderColor: "border-b-orange-500",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden border-b-4 ${kpi.borderColor} flex items-start gap-4`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
            {kpi.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-sm font-semibold text-gray-700">{kpi.title}</h3>
              <Info size={12} className="text-gray-400 cursor-help" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
            <p className="text-[11px] text-gray-500 font-medium">{kpi.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
