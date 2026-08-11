import React from "react";
import { StartupProfile } from "@/lib/data/startups";
import { Target, Megaphone, PlaySquare, Trophy, TrendingUp, Play, Award } from "lucide-react";

export default function ProfileInfoGrid({ startup }: { startup: StartupProfile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      
      {/* 1. Besoins */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Target className="text-[#964594]" size={24} />
          <h3 className="font-serif font-bold text-lg text-[#47295C]">Besoins</h3>
        </div>
        <ul className="space-y-4">
          {startup.needs.map((need, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#964594] mt-2 shrink-0"></div>
              <p className="text-sm text-gray-600 leading-relaxed">{need}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Actualités */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="text-[#964594]" size={24} />
            <h3 className="font-serif font-bold text-lg text-[#47295C]">Actualités</h3>
          </div>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          {startup.news.map((item) => (
            <div key={item.id} className="flex flex-col gap-1">
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{item.title}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
          ))}
        </div>
        <button className="text-xs font-bold text-[#47295C] hover:text-[#964594] transition-colors mt-auto text-left flex items-center gap-1 w-fit group">
          Voir toutes les actualités 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* 3. Vidéos */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <PlaySquare className="text-[#964594]" size={24} />
          <h3 className="font-serif font-bold text-lg text-[#47295C]">Vidéos</h3>
        </div>
        
        <div className="w-full aspect-video rounded-xl bg-[#47295C] relative overflow-hidden group cursor-pointer border border-gray-200">
          <div className="absolute inset-0 bg-[url('/placeholder-video.jpg')] bg-cover bg-center opacity-50 mix-blend-overlay group-hover:opacity-70 transition-opacity"></div>
          {/* Play Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/20 group-hover:scale-110 transition-transform">
            <Play className="text-white ml-1" size={20} />
          </div>
        </div>

        <button className="text-xs font-bold text-[#47295C] hover:text-[#964594] transition-colors mt-auto text-left flex items-center gap-1 w-fit group">
          Voir toutes les vidéos
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* 4. Récompenses */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6 md:col-span-1">
        <div className="flex items-center gap-3">
          <Trophy className="text-[#964594]" size={24} />
          <h3 className="font-serif font-bold text-lg text-[#47295C]">Récompenses</h3>
        </div>
        <div className="flex flex-col gap-6">
          {startup.awards.map((award) => (
            <div key={award.id} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#47295C] shrink-0 mt-1">
                <Award size={16} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold text-[#47295C]">{award.title}</p>
                <p className="text-xs text-gray-500">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Levées de fonds */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-8 md:col-span-2">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-[#964594]" size={24} />
          <h3 className="font-serif font-bold text-lg text-[#47295C]">Levées de fonds</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Current */}
          <div className="flex flex-col gap-1">
            <h4 className="font-extrabold text-2xl text-[#47295C]">{startup.funding.raisedAmount}</h4>
            <p className="text-xs text-gray-500">Levés à ce jour</p>
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <p className="text-sm font-medium text-gray-600">{startup.funding.round} – {startup.funding.year}</p>
            <p className="text-xs text-gray-500 max-w-[200px] md:text-right mt-1">Investisseurs : {startup.funding.investors}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex relative mt-2">
          <div 
            className="h-full bg-[#47295C] rounded-full relative z-10" 
            style={{ width: `${startup.funding.progressPercent}%` }}
          ></div>
        </div>

        {/* Next Round Goal */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">Prochaine levée</p>
            <p className="text-sm font-bold text-[#964594]">{startup.funding.nextRound.type}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <p className="text-xs text-gray-600 font-medium">Objectif : {startup.funding.nextRound.goal}</p>
            <p className="text-xs text-gray-500">{startup.funding.nextRound.date}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
