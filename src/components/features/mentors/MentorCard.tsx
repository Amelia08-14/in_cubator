import React from "react";
import { Mentor } from "@/lib/data/mentors";
import { Star, Lock } from "lucide-react";

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col hover:shadow-md hover:border-gray-200 transition-all">
      
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-16 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
          {/* Actual image would go here with Next/Image */}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 py-1">
          <h3 className="font-serif font-bold text-lg text-[#47295C] leading-tight truncate">{mentor.name}</h3>
          <p className="text-[11px] text-gray-500 font-medium mb-3 truncate">{mentor.role}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {mentor.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded border border-[#964594]/30 text-[#47295C] text-[9px] font-bold tracking-wide whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-auto">
            <Star className="text-yellow-400 fill-yellow-400" size={12} />
            <span className="text-[11px] font-bold text-gray-700">{mentor.rating}</span>
            <span className="text-[11px] text-gray-400">({mentor.reviewCount} avis)</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full mt-5 py-2.5 rounded-lg border-2 border-[#47295C]/10 text-[#47295C] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#47295C]/5 transition-colors group">
        Rejoindre
        <Lock size={14} className="text-[#964594] group-hover:scale-110 transition-transform" />
      </button>

    </div>
  );
}
