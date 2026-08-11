import React from "react";
import VitrineFilters from "@/components/features/vitrine/VitrineFilters";
import StartupDirectoryCard from "@/components/features/vitrine/StartupDirectoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startupsData } from "@/lib/data/startups";

export default function VitrinePage() {
  return (
    <div className="min-h-screen bg-white text-[#47295C] pt-32 pb-24" data-theme="light">
      
      <main className="max-w-[1300px] mx-auto px-8 w-full relative z-10">
        
        {/* Background Decorative Curve (subtle) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none -z-10 opacity-[0.03]">
          <svg viewBox="0 0 500 500" className="w-full h-full stroke-[#47295C] fill-none">
            <path d="M 0 500 Q 250 100 500 0" strokeWidth="2" />
            <path d="M -100 500 Q 150 200 500 100" strokeWidth="1" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 pt-8">
          <div className="flex flex-col max-w-2xl">
            <h4 className="text-[#964594] font-bold text-xs tracking-widest uppercase mb-6 flex flex-col">
              VITRINE
              <div className="h-[2px] w-8 bg-[#964594] mt-3"></div>
            </h4>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-extrabold leading-[1.1] tracking-tight">
              Découvrez les startups<br />de l'écosystème IN-CUBATOR<span className="text-[#964594]">.</span>
            </h1>
          </div>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xs mb-2">
            Des projets innovants, accompagnés pour changer la santé et l'avenir.
          </p>
        </div>

        {/* Filters */}
        <VitrineFilters />

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {startupsData.map((startup) => (
            <StartupDirectoryCard 
              key={startup.id}
              {...startup}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-20">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">
            <ChevronLeft size={18} />
          </button>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#47295C] text-white font-bold text-sm shadow-md">
            1
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-medium text-sm">
            2
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-medium text-sm">
            3
          </button>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#47295C] hover:bg-gray-100 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

      </main>

    </div>
  );
}
