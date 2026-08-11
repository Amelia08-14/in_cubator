import React from "react";
import { TeamMember } from "@/lib/data/startups";
import { ArrowRight } from "lucide-react";

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function ProfileTeam({ team }: { team: TeamMember[] }) {
  if (!team || team.length === 0) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
        <div className="relative">
          <h3 className="text-xl font-serif font-extrabold text-[#47295C]">Équipe</h3>
          <div className="absolute -bottom-[18px] left-0 w-8 h-[3px] bg-[#964594]"></div>
        </div>
        <button className="text-xs font-bold text-[#47295C] hover:text-[#964594] transition-colors flex items-center gap-1 group">
          Voir toute l'équipe
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Avatar Placeholder */}
            <div className="w-full aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200">
               {/* In a real app we'd use Next/Image here */}
            </div>
            
            <div className="p-4 flex flex-col items-start gap-1">
              <h4 className="font-bold text-sm text-[#47295C]">{member.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{member.role}</p>
              
              <a href={member.linkedin} className="mt-auto w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-[#964594] hover:text-white transition-colors">
                <LinkedinIcon size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
