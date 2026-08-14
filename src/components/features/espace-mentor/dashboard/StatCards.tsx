import React from "react";
import { Clock, Users, Star, Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function StatCards({ totalHours, uniqueStartups, sessionsThisMonth }: { totalHours: number, uniqueStartups: number, sessionsThisMonth: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#f1edfa] flex items-center justify-center text-[#47295C] shrink-0">
            <Clock size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 leading-tight">Heures de mentorat ce mois-ci</h4>
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900 mb-1">{totalHours}h</div>
          {/* <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <span>+12% vs mois dernier</span>
            <ArrowUpRight size={14} />
          </div> */}
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Users size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 leading-tight">Startups accompagnées</h4>
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900 mb-1">{uniqueStartups}</div>
          {/* <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <span>+1 ce mois-ci</span>
            <ArrowUpRight size={14} />
          </div> */}
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <Star size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 leading-tight">Sessions réalisées ce mois-ci</h4>
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900 mb-1">{sessionsThisMonth}</div>
          <button className="flex items-center gap-1 text-xs font-semibold text-[#47295C] hover:text-[#5a3875] transition-colors">
            <span>Voir le rapport</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Card 4 - Availability CTA */}
      <div className="bg-[#47295C] rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
        {/* Background Decoration */}
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute right-10 -bottom-10 w-24 h-24 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        
        <div className="flex items-start gap-3 mb-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-md border border-white/30">
            <Calendar size={16} strokeWidth={2.5} />
          </div>
          <h4 className="text-sm font-bold leading-tight">Nouvelles disponibilités la semaine pro. ?</h4>
        </div>
        <div className="relative z-10 mt-auto">
          <p className="text-xs text-purple-100 mb-3 leading-relaxed">
            Tenez votre calendrier à jour pour recevoir plus de demandes.
          </p>
          <Link href="/espace-mentor/disponibilites" className="flex items-center justify-center gap-2 w-full bg-white text-[#47295C] font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors text-xs">
            Gérer mes disponibilités
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
