import { ChevronDown, RefreshCw } from "lucide-react";
import React from "react";

export default function VitrineFilters() {
  return (
    <div className="w-full flex flex-col md:flex-row items-end justify-between gap-6 pb-8 border-b border-gray-100 mb-12">
      
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
        {/* Secteur Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-72">
          <label className="text-xs font-bold text-[#47295C] ml-1">Secteur</label>
          <div className="relative">
            <select className="w-full appearance-none bg-transparent border border-gray-200 rounded-md py-3 px-4 text-sm text-gray-700 outline-none focus:border-[#964594] transition-colors cursor-pointer">
              <option value="">Tous les secteurs</option>
              <option value="Health Tech">Health Tech</option>
              <option value="MedTech">MedTech</option>
              <option value="Biotechnologies">Biotechnologies</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="AgriTech">AgriTech</option>
              <option value="Blue Economy">Blue Economy</option>
              <option value="Women Entrepreneurship">Women Entrepreneurship</option>
              <option value="Green Health">Green Health</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#47295C] pointer-events-none" />
          </div>
        </div>

        {/* Stade Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-72">
          <label className="text-xs font-bold text-[#47295C] ml-1">Stade</label>
          <div className="relative">
            <select className="w-full appearance-none bg-transparent border border-gray-200 rounded-md py-3 px-4 text-sm text-gray-700 outline-none focus:border-[#964594] transition-colors cursor-pointer">
              <option value="">Tous les stades</option>
              <option value="Ideation">Ideation</option>
              <option value="Seed">Seed</option>
              <option value="Early Stage">Early Stage</option>
              <option value="Growth">Growth</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#47295C] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button className="flex items-center gap-2 text-sm font-bold text-[#47295C] hover:text-[#964594] transition-colors px-2 py-3 group">
        <RefreshCw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
        Réinitialiser
      </button>

    </div>
  );
}
