import React from "react";
import { ArrowRight, Leaf, Lightbulb, Code2, BarChart3, Calendar as CalendarIcon, Video, FileText } from "lucide-react";
import Link from "next/link";

export default function UpcomingAppointments({ appointments = [] }: { appointments?: any[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Prochains rendez-vous</h2>
        <Link href="#" className="text-sm font-semibold text-[#47295C] hover:text-[#5a3875] flex items-center gap-1 transition-colors">
          Voir tout <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {appointments.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Aucun rendez-vous à venir.
          </div>
        ) : (
          appointments.map((app) => {
            const startupName = app.startup?.nomEntreprise || app.startup?.user?.email?.split('@')[0] || "Startup Inconnue";
            const sectors = app.startup?.secteurs || [];
            const sectorStr = Array.isArray(sectors) ? sectors.join(', ') : (typeof sectors === 'string' ? sectors : 'Non spécifié');
            
            const dateStr = app.disponibilite?.dateDebut ? new Date(app.disponibilite.dateDebut).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' }) : "Date à définir";
            const timeStr = app.disponibilite?.dateDebut ? new Date(app.disponibilite.dateDebut).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : "";
            const formatStr = app.disponibilite?.format || "En ligne";

            return (
              <div key={app.id} className="border border-gray-100 rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                    <CalendarIcon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{startupName}</h4>
                    <p className="text-[10px] text-gray-500 font-medium truncate max-w-[120px]">{sectorStr}</p>
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-700">
                        <CalendarIcon size={12} className="text-gray-400" />
                        {dateStr}
                      </div>
                      {timeStr && <div className="text-[10px] font-semibold text-gray-500 text-center">{timeStr}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-end gap-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                    formatStr.includes("Visio") 
                      ? "bg-[#f1edfa] text-[#47295C]" 
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    {formatStr}
                  </span>
                  
                  {app.lienVisio && (
                    <a href={app.lienVisio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors text-[#47295C] border-[#47295C] hover:bg-[#f1edfa]">
                      Rejoindre
                      <Video size={14} strokeWidth={2.5} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
