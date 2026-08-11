import React from "react";
import { StartupProfile } from "@/lib/data/startups";
import { Globe, Mail, MapPin, Calendar, TrendingUp, Tag } from "lucide-react";

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function ProfileHeader({ startup }: { startup: StartupProfile }) {
  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start mt-8">
      
      {/* Left: Logo Box */}
      <div className="w-full lg:w-[350px] shrink-0 bg-gray-50 rounded-3xl p-12 aspect-square flex flex-col items-center justify-center border border-gray-100 shadow-sm">
        {startup.logoIcon}
        <h2 className="mt-6 font-serif font-bold text-3xl text-[#47295C]">{startup.name}</h2>
      </div>

      {/* Center: Info */}
      <div className="flex-1 flex flex-col pt-4">
        <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-[#47295C] mb-4">
          {startup.name}
          <span className="text-[#964594]">.</span>
        </h1>
        
        <p className="text-gray-600 text-lg font-medium mb-6">
          {startup.shortDescription}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-4 mb-8">
          <span className="px-4 py-1.5 rounded border border-[#964594] text-[#964594] text-xs font-bold tracking-wide">
            {startup.sector}
          </span>
          <span className="text-xs font-bold text-gray-400">
            Stade <span className="text-[#47295C] mx-1">•</span> <span className="text-[#47295C]">{startup.stage}</span>
          </span>
        </div>

        {/* Long Description */}
        <div className="space-y-4 mb-8">
          {startup.longDescription.map((desc, i) => (
            <p key={i} className="text-gray-500 text-sm leading-relaxed">
              {desc}
            </p>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a href={startup.website} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#964594] hover:border-[#964594] transition-all">
            <Globe size={18} />
          </a>
          <a href={startup.linkedin} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#964594] hover:border-[#964594] transition-all">
            <LinkedinIcon size={18} />
          </a>
          <a href={`mailto:${startup.contact.email}`} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#964594] hover:border-[#964594] transition-all">
            <Mail size={18} />
          </a>
        </div>
      </div>

      {/* Right: Summary Card */}
      <div className="w-full lg:w-[320px] shrink-0 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col gap-8 shadow-sm">
        
        <div className="flex items-start gap-4">
          <Tag className="text-[#964594] mt-1 shrink-0" size={20} />
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Secteur</p>
            <p className="text-sm font-bold text-[#47295C]">{startup.sector}</p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200/60"></div>

        <div className="flex items-start gap-4">
          <TrendingUp className="text-[#964594] mt-1 shrink-0" size={20} />
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Stade actuel</p>
            <p className="text-sm font-bold text-[#47295C]">{startup.stage}</p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200/60"></div>

        <div className="flex items-start gap-4">
          <Calendar className="text-[#964594] mt-1 shrink-0" size={20} />
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Année de création</p>
            <p className="text-sm font-bold text-[#47295C]">{startup.foundedYear}</p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200/60"></div>

        <div className="flex items-start gap-4">
          <MapPin className="text-[#964594] mt-1 shrink-0" size={20} />
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Basée à</p>
            <p className="text-sm font-bold text-[#47295C]">{startup.location}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
