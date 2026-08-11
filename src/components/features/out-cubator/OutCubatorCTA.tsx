import React from "react";
import { Sprout, ArrowRight } from "lucide-react";

export default function OutCubatorCTA() {
  return (
    <section className="w-full max-w-[1100px] mx-auto px-8 pb-24">
      
      <div className="w-full bg-[#1A1025] rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        {/* Subtle background lines/rings */}
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] pointer-events-none opacity-20 translate-x-1/4 translate-y-1/4">
          <div className="absolute inset-0 rounded-full border-[1px] border-white/20"></div>
          <div className="absolute inset-8 rounded-full border-[1px] border-white/20"></div>
          <div className="absolute inset-16 rounded-full border-[1px] border-white/20"></div>
          <div className="absolute inset-24 rounded-full border-[1px] border-white/20"></div>
        </div>

        <div className="flex items-center gap-6 lg:gap-10 relative z-10">
          
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center shrink-0">
            <Sprout className="text-white" size={32} strokeWidth={1.5} />
          </div>
          
          <div className="flex flex-col gap-2 max-w-[480px]">
            <h3 className="font-serif font-bold text-xl md:text-2xl text-white leading-tight">
              Bâtissons ensemble des écosystèmes entrepreneuriaux qui durent.
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Out-Cubator œuvre pour un futur où chaque territoire peut 
              faire émerger, soutenir et transmettre ses talents.
            </p>
          </div>

        </div>

        <button className="w-full md:w-auto shrink-0 border border-white/20 text-white bg-transparent px-8 py-3 rounded-md text-xs font-bold tracking-wide hover:bg-white/10 transition-colors flex items-center justify-center gap-6 group relative z-10">
          Découvrir nos actions
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

    </section>
  );
}
