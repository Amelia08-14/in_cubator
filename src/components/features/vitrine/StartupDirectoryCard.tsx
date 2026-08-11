import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export type Sector = 
  | "Health Tech" 
  | "MedTech" 
  | "Biotechnologies" 
  | "Pharmacy" 
  | "AgriTech" 
  | "Blue Economy" 
  | "Women Entrepreneurship" 
  | "Green Health";

export interface StartupDirectoryCardProps {
  name: string;
  description: string;
  sector: Sector;
  stage: "Ideation" | "Seed" | "Early Stage" | "Growth";
  logoIcon: React.ReactNode;
  slug: string;
}

export default function StartupDirectoryCard({
  name,
  description,
  sector,
  stage,
  logoIcon,
  slug
}: StartupDirectoryCardProps) {
  
  // Helper to determine sector colors based on the design palette
  const getSectorColor = (sector: Sector) => {
    switch (sector) {
      case "AgriTech":
      case "Green Health":
        return "text-[#73B866] border-[#73B866]";
      case "Blue Economy":
        return "text-[#235BA8] border-[#235BA8]";
      case "Biotechnologies":
        return "text-[#47295C] border-[#47295C]";
      default:
        return "text-[#964594] border-[#964594]"; // Default Purple for Health Tech, MedTech, Pharmacy, etc.
    }
  };

  return (
    <Link href={`/vitrine/${slug}`} className="block group">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full flex flex-col justify-between">
        
        {/* Top: Logo & Info */}
        <div className="flex gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform">
            {logoIcon}
          </div>
          <div className="flex flex-col">
            <h3 className="font-serif font-bold text-lg text-[#47295C] mb-1">{name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom: Badges & Arrow */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-sm border text-[10px] font-bold tracking-wide ${getSectorColor(sector)}`}>
              {sector}
            </span>
            <span className="text-[10px] font-bold text-gray-400">
              Stade • <span className="text-[#47295C]">{stage}</span>
            </span>
          </div>
          <ArrowRight size={18} className="text-[#964594] group-hover:translate-x-1 transition-transform" />
        </div>

      </div>
    </Link>
  );
}
