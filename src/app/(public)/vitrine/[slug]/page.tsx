import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { startupsData } from "@/lib/data/startups";

import ProfileHeader from "@/components/features/vitrine/profile/ProfileHeader";
import ProfileTeam from "@/components/features/vitrine/profile/ProfileTeam";
import ProfileInfoGrid from "@/components/features/vitrine/profile/ProfileInfoGrid";
import ProfileContact from "@/components/features/vitrine/profile/ProfileContact";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function StartupProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const startup = startupsData.find((s) => s.slug === slug);

  if (!startup) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-[#47295C] pt-32 pb-24" data-theme="light">
      <main className="max-w-[1100px] mx-auto px-8 w-full relative z-10 flex flex-col gap-12">
        
        {/* Back Link */}
        <Link 
          href="/vitrine" 
          className="flex items-center gap-2 text-xs font-bold text-[#47295C] hover:text-[#964594] transition-colors w-fit group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Retour à la vitrine
        </Link>

        {/* 1. Header Section */}
        <ProfileHeader startup={startup} />

        <div className="w-full h-[1px] bg-gray-100 my-4"></div>

        {/* 2. Content Grid (Presentation + Team) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Présentation (Left Column) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <div className="relative">
                <h3 className="text-xl font-serif font-extrabold text-[#47295C]">Présentation</h3>
                <div className="absolute -bottom-[18px] left-0 w-8 h-[3px] bg-[#964594]"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              {startup.longDescription.map((desc, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">
                  {desc}
                </p>
              ))}
            </div>
          </div>

          {/* Équipe (Right Column) */}
          <div className="lg:col-span-8">
            <ProfileTeam team={startup.team} />
          </div>

        </div>

        {/* 3. Info Grid Section (Needs, News, Videos, Awards, Funding) */}
        <ProfileInfoGrid startup={startup} />

        {/* 4. Contact Section */}
        <ProfileContact startup={startup} />

      </main>
    </div>
  );
}
