import React from "react";
import { ChevronDown, RotateCcw } from "lucide-react";

export default function MentorsFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-end w-full max-w-[1100px] mx-auto mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm z-10 relative">
      
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-[#47295C] mb-2">Secteur</label>
        <div className="relative w-full">
          <select className="w-full appearance-none bg-white border border-gray-200 text-sm text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#964594]/20 focus:border-[#964594] transition-all cursor-pointer">
            <option value="">Tous les secteurs</option>
            <option value="Health Tech">Health Tech</option>
            <option value="MedTech">MedTech</option>
            <option value="Biotechnologies">Biotechnologies</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#47295C] pointer-events-none" size={16} />
        </div>
      </div>

      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-[#47295C] mb-2">Expertise</label>
        <div className="relative w-full">
          <select className="w-full appearance-none bg-white border border-gray-200 text-sm text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#964594]/20 focus:border-[#964594] transition-all cursor-pointer">
            <option value="">Toutes les expertises</option>
            <option value="Financial Modeling">Financial Modeling</option>
            <option value="Medical Regulatory">Medical Regulatory</option>
            <option value="Growth Strategy">Growth Strategy</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#47295C] pointer-events-none" size={16} />
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 px-6 py-3 shrink-0 text-sm font-bold text-[#47295C] hover:text-[#964594] transition-colors mb-1 group">
        <RotateCcw size={16} className="group-hover:-rotate-90 transition-transform duration-300" />
        Réinitialiser
      </button>

    </div>
  );
}
