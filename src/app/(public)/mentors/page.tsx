import React from "react";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

import MentorsFilters from "@/components/features/mentors/MentorsFilters";
import MentorCard from "@/components/features/mentors/MentorCard";
import MentoringCallToAction from "@/components/features/mentors/MentoringCallToAction";

export default async function MentorsPage() {
  const dbMentors = await prisma.mentorProfile.findMany({
    where: { actif: true },
  });

  const formattedMentors = dbMentors.map((m) => {
    // Determine a primary role from expertise array (or use bio/secteurs)
    const expertiseArray = Array.isArray(m.expertise) ? m.expertise as string[] : [];
    const secteursArray = Array.isArray(m.secteurs) ? m.secteurs as string[] : [];
    
    return {
      id: m.id,
      name: m.nomComplet,
      role: expertiseArray.length > 0 ? expertiseArray[0] : "Expert(e)",
      tags: secteursArray.slice(0, 2), // Take first two sectors as tags
      rating: m.noteMoyenne || 5.0,
      reviewCount: 0, // Mock review count for now as it's not in schema
      image: "/placeholder-avatar.png",
    };
  });

  return (
    <div className="min-h-screen bg-white text-[#47295C] pt-32 pb-24 relative overflow-x-hidden" data-theme="light">
      
      {/* Background Hero Graphic */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none opacity-40">
        <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#47295C]/20"></div>
        {/* Orbital dots */}
        <div className="absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-[#964594]"></div>
        <div className="absolute top-[70%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#964594]"></div>
        
        {/* Icon Circle */}
        <div className="absolute top-[20%] right-[25%] w-24 h-24 rounded-full bg-[#F3EEF5] flex items-center justify-center">
          <Users size={40} className="text-[#964594]" />
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-8 w-full relative z-10 flex flex-col">
        
        {/* Breadcrumb / Tag */}
        <span className="text-xs font-bold text-[#47295C] tracking-widest uppercase mb-6">
          Mentors
        </span>

        {/* Hero Content */}
        <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-[#47295C] max-w-2xl leading-[1.1] mb-6">
          Nos mentors experts <br /> à vos côtés.
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-lg mb-12">
          Trouvez les experts qui vous accompagneront à chaque étape de votre croissance.
        </p>

        {/* Filters */}
        <MentorsFilters />

        {/* Grid */}
        {formattedMentors.length === 0 ? (
          <div className="mt-12 mb-16 p-12 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun mentor disponible</h3>
            <p className="text-gray-500">Nous ajoutons constamment de nouveaux experts à notre réseau. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 mb-16">
            {formattedMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}

        {/* CTA */}
        <MentoringCallToAction />

      </main>
    </div>
  );
}
