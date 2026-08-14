"use client";

import React from "react";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AlertData {
  id: number;
  type: string;
  label: string;
  message: string;
  time: string;
  color: string;
  bg: string;
  border: string;
  icon?: React.ReactNode;
}

export default function AdminAlertsCenter({ alerts = [] }: { alerts?: AlertData[] }) {
  // Map icons based on type since passing React elements from Server to Client component isn't straightforward
  const displayAlerts = alerts.map(alert => ({
    ...alert,
    icon: alert.type === 'urgent' ? <AlertCircle size={16} className={alert.color} /> :
          alert.type === 'warning' ? <AlertTriangle size={16} className={alert.color} /> :
          <Info size={16} className={alert.color} />
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#47295C] flex items-center gap-2">
          <Bell size={18} />
          Centre d'alertes
        </h3>
        <button className="text-[11px] font-bold text-gray-500 hover:text-[#47295C] transition-colors">
          Voir tout (18)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayAlerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl border ${alert.border} ${alert.bg} flex gap-4 items-start`}>
            <div className="mt-1 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
              {alert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wide ${alert.color}`}>
                  {alert.label}
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                  {alert.time}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-900 leading-snug">
                {alert.message}
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <div className={`w-2 h-2 rounded-full ${alert.color.replace('text-', 'bg-')}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
        <Link href="#" className="inline-block px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-white transition-colors">
          Voir toutes les alertes
        </Link>
      </div>
    </div>
  );
}
