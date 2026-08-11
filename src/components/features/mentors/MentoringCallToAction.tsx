import React from "react";
import { Lock, ArrowRight } from "lucide-react";

export default function MentoringCallToAction() {
  return (
    <div className="w-full max-w-[1100px] mx-auto mt-12 bg-[#F9F7FA] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-full bg-white border border-[#47295C]/10 flex items-center justify-center shrink-0 shadow-sm">
          <Lock className="text-[#964594]" size={24} />
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg text-[#47295C]">
            Rejoindre pour accéder au marketplace de mentoring
          </h3>
          <p className="text-sm text-gray-500">
            Créez votre compte ou connectez-vous pour réserver des sessions avec nos mentors.
          </p>
        </div>
      </div>

      <button className="w-full md:w-auto shrink-0 bg-[#47295C] text-white px-8 py-3.5 rounded-lg text-sm font-bold tracking-wide hover:bg-[#964594] transition-colors flex items-center justify-center gap-2 group shadow-md shadow-[#47295C]/20">
        Se connecter / S'inscrire
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
}
