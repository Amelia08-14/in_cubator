"use client";

import React from "react";
import { Mentor } from "@/lib/data/mentors";
import { Star, Calendar, Bookmark } from "lucide-react";

interface EspaceMentorCardProps {
  mentor: Mentor;
  onBook: (mentor: Mentor) => void;
}

export default function EspaceMentorCard({ mentor, onBook }: EspaceMentorCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col hover:shadow-lg hover:border-[#964594]/20 transition-all group relative">
      
      {/* Top Badge (optional, e.g. for top mentors like Lina in the mockup) */}
      {mentor.name === "Dr. Lina Merzouk" && (
        <div className="absolute -top-3 left-6 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          Top mentor
        </div>
      )}

      <button className="absolute top-4 right-4 text-gray-400 hover:text-[#47295C] transition-colors">
        <Bookmark size={18} />
      </button>

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-100 shrink-0 overflow-hidden relative border-2 border-white shadow-sm mt-1">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
          {/* Avatar goes here. I'll mock a colored circle for now or keep empty */}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 py-1">
          <h3 className="font-bold text-base text-[#47295C] leading-tight truncate flex items-center gap-1">
            {mentor.name}
            {/* Verified tick */}
            <svg className="w-3.5 h-3.5 text-[#964594]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          </h3>
          <p className="text-[11px] text-gray-500 font-medium mb-3 truncate">{mentor.role}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-2">
            {mentor.tags.map((tag, i) => {
              // Quick mockup colors for tags
              const colorClass = 
                tag === 'MedTech' || tag === 'HealthTech' ? 'text-purple-600 bg-purple-50' :
                tag === 'Pharma' || tag === 'Biotech' ? 'text-blue-600 bg-blue-50' :
                tag === 'SaaS' || tag === 'AI' ? 'text-green-600 bg-green-50' :
                tag === 'Legal' || tag === 'Operations' ? 'text-indigo-600 bg-indigo-50' :
                tag === 'Marketing' || tag === 'B2B' ? 'text-teal-600 bg-teal-50' :
                'text-[#47295C] bg-[#47295C]/5';

              return (
                <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide whitespace-nowrap ${colorClass}`}>
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 mb-3">
        <Star className="text-yellow-400 fill-yellow-400" size={14} />
        <span className="text-[11px] font-bold text-gray-700">{mentor.rating}</span>
        <span className="text-[11px] text-gray-400">({mentor.reviewCount} avis)</span>
      </div>
      
      {/* Bio / Description mockup text based on screenshot */}
      <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3 mb-6 flex-1">
        {mentor.name === "Dr. Lina Merzouk" && "15+ ans d'expérience en stratégie d'entrée marché et affaires réglementaires pour les dispositifs médicaux."}
        {mentor.name === "Karim Belkacem" && "Ancien banquier d'investissement. Spécialiste des levées de fonds et modélisation financière."}
        {mentor.name === "Doria Ait-Salah" && "Ex-CTO startup scale-up. Experte en product strategy et architecture."}
        {mentor.name === "Yacine Berrada" && "Avocat spécialisé en IP et contrats tech. Protection et valorisation des innovations."}
        {mentor.name === "Amal Hamdi" && "Experte en growth marketing et stratégies acquisition B2B."}
        {mentor.name === "Mehdi El Idrissi" && "Optimisation des opérations et supply chain dans les environnements réglementés."}
        {/* Fallback */}
        {mentor.name !== "Dr. Lina Merzouk" && mentor.name !== "Karim Belkacem" && mentor.name !== "Doria Ait-Salah" && mentor.name !== "Yacine Berrada" && mentor.name !== "Amal Hamdi" && mentor.name !== "Mehdi El Idrissi" && "Expert reconnu dans son domaine avec plusieurs années d'accompagnement de startups innovantes."}
      </p>

      {/* Action Button */}
      <button 
        onClick={() => onBook(mentor)}
        className="w-full mt-auto py-3 rounded-xl bg-[#47295C] hover:bg-[#964594] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Calendar size={14} />
        Réserver un créneau
      </button>

    </div>
  );
}
