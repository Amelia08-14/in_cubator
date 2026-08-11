import React from "react";
import { Users, Share2, Leaf, Landmark } from "lucide-react";
import OutCubatorGlobe from "./OutCubatorGlobe";

export default function OutCubatorHero() {
  return (
    <section className="relative w-full max-w-[1100px] mx-auto px-8 pt-32 pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 overflow-x-hidden">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col z-10 max-w-xl">
        <span className="text-[10px] font-bold text-[#47295C] tracking-widest uppercase mb-6">
          OUT-CUBATOR
        </span>
        
        <h1 className="font-serif font-extrabold text-5xl md:text-[56px] text-[#47295C] leading-[1.1] mb-8">
          Concevoir aujourd'hui <br /> les écosystèmes de demain.
        </h1>
        
        <div className="w-12 h-1 bg-[#47295C] mb-8"></div>
        
        <p className="text-gray-500 text-lg leading-relaxed">
          Out-Cubator est une structure stratégique dédiée à la conception, 
          à la structuration et au pilotage de systèmes d'incubation durables.
        </p>
      </div>

      {/* Right Graphic (Orbital Globe) */}
      <div className="flex-1 w-full flex justify-center lg:justify-end relative min-h-[500px]">
        <div className="relative w-[440px] h-[440px] flex items-center justify-center">
          
          {/* Outer Orbital Ring */}
          <div className="absolute inset-4 rounded-full border border-gray-200/60 z-0"></div>
          
          {/* Inner Dotted Circle */}
          <div className="absolute inset-16 rounded-full border border-gray-100 bg-white/50 z-10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
                backgroundPosition: 'center'
              }}></div>
          </div>

          {/* Center 3D Globe */}
          <div className="relative z-20 w-80 h-80 flex items-center justify-center">
            <OutCubatorGlobe />
          </div>

          {/* Tiny Satellite Dots on the Orbital Ring */}
          <div className="absolute top-[14.6%] right-[14.6%] w-2 h-2 rounded-full bg-[#964594] z-20"></div>
          <div className="absolute bottom-[14.6%] right-[14.6%] w-2 h-2 rounded-full bg-[#964594] z-20"></div>
          <div className="absolute bottom-[14.6%] left-[14.6%] w-2 h-2 rounded-full bg-[#964594] z-20"></div>
          <div className="absolute top-[14.6%] left-[14.6%] w-2 h-2 rounded-full bg-[#964594] z-20"></div>

          {/* Orbital Icons */}
          {/* Top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110">
            <Users className="text-[#47295C]" size={22} strokeWidth={1.5} />
          </div>

          {/* Right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110">
            <Landmark className="text-[#47295C]" size={22} strokeWidth={1.5} />
          </div>

          {/* Bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110">
            <Leaf className="text-[#47295C]" size={22} strokeWidth={1.5} />
          </div>

          {/* Left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110">
            <Share2 className="text-[#47295C]" size={22} strokeWidth={1.5} />
          </div>
          
        </div>
      </div>
      
    </section>
  );
}
