"use client";

import React from "react";
import { Wallet, Rocket, FileText, TrendingUp, Info } from "lucide-react";

export default function PortfolioKPIs({ initialData = [] }: { initialData?: any[] }) {
  const kpis = initialData;

  const getIcon = (type: string) => {
    switch (type) {
      case "wallet": return <Wallet size={20} className="text-[#47295C]" />;
      case "rocket": return <Rocket size={20} className="text-green-600" />;
      case "filetext": return <FileText size={20} className="text-orange-500" />;
      case "trending": return <TrendingUp size={20} className="text-blue-500" />;
      default: return <Info size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
              {getIcon(kpi.iconType)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-xs font-bold text-gray-600">{kpi.title}</h3>
                <Info size={12} className="text-gray-400 cursor-help" />
              </div>
              <p className="text-2xl font-bold text-[#47295C] mb-1">{kpi.value}</p>
              <p className="text-[10px] text-gray-500 font-medium">{kpi.subtitle}</p>
            </div>
          </div>

          {/* Decorative Sparkline Chart */}
          <div className="absolute bottom-4 left-5 right-5 h-8 opacity-50 pointer-events-none">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
              <path 
                d={`M0,10 Q10,${(kpi.id * 5) % 20} 20,10 T40,10 T60,10 T80,10 T100,10`} 
                fill="none" 
                className={kpi.chartColor} 
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
