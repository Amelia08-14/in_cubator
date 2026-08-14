"use client";

import React from "react";
import { Building2, Megaphone, Rocket } from "lucide-react";

interface OpenInnovationStats {
  audits: number;
  appels: number;
  pilotes: number;
}

export default function AdminOpenInnovationStats({ data }: { data?: OpenInnovationStats }) {
  const stats = [
    {
      title: "Audits en cours",
      value: data?.audits || 0,
      trend: "+0 depuis le mois dernier",
      icon: <Building2 size={24} className="text-[#47295C]" />,
      iconBg: "bg-[#f1edfa]",
      borderColor: "border-gray-200"
    },
    {
      title: "Appels à projets actifs",
      value: data?.appels || 0,
      trend: "+0 depuis le mois dernier",
      icon: <Megaphone size={24} className="text-blue-600" />,
      iconBg: "bg-blue-50",
      borderColor: "border-gray-200"
    },
    {
      title: "Pilotes déployés",
      value: data?.pilotes || 0,
      trend: "+0 depuis le mois dernier",
      icon: <Rocket size={24} className="text-green-600" />,
      iconBg: "bg-green-50",
      borderColor: "border-gray-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
            {stat.icon}
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 mb-1">{stat.title}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1 leading-none">{stat.value}</div>
            <p className="text-[11px] text-gray-500 font-medium">{stat.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
