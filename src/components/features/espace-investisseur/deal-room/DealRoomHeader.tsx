"use client";

import React from "react";
import Image from "next/image";

export default function DealRoomHeader() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 mt-4">
      {/* Left side: Identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-24 h-24 rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden shrink-0 relative flex items-center justify-center p-2">
          {/* Mock Logo using Image (you'd pass the actual logo prop) */}
          <Image 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80" 
            alt="NovaTech Logo" 
            fill 
            className="object-cover" 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-2xl font-bold text-[#47295C]">Deal Room : NovaTech</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#f1edfa] text-[#47295C] rounded-lg text-xs font-bold border border-[#eaddf7]">
                MedTech
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                Seed
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
            Plateforme IA pour l'imagerie médicale permettant un diagnostic plus rapide et plus précis.
          </p>
        </div>
      </div>

      {/* Right side: Funding Progress */}
      <div className="w-full md:w-[350px] bg-gray-50/50 rounded-xl p-5 border border-gray-100 shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Levée en cours</p>
            <p className="text-3xl font-bold text-[#47295C] leading-none">500 000 DZD</p>
            <p className="text-xs text-gray-500 mt-1">Objectif de la levée</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span>300 000 DZD engagés (60%)</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#47295C] rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
