"use client";

import React, { useState } from "react";
import Header from "@/components/features/espace/Header";
import { Mentor } from "@/lib/data/mentors";
import EspaceMentorsFilters from "@/components/features/espace/mentors/EspaceMentorsFilters";
import EspaceMentorCard from "@/components/features/espace/mentors/EspaceMentorCard";
import BookingModal from "@/components/features/espace/mentors/BookingModal";

interface Props {
  initialMentors: any[];
  startupId: string;
}

export default function EspaceMentorsClient({ initialMentors, startupId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);

  const handleBookClick = (mentor: any) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-[#f8f9fa] relative">
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#47295C] mb-2">Mentors</h1>
            <p className="text-sm text-gray-500">
              Trouvez le bon expert et réservez un créneau pour avancer plus vite.
            </p>
          </div>

          <EspaceMentorsFilters />

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-700">
              {initialMentors.length} mentors disponibles
            </h2>
          </div>

          {initialMentors.length === 0 ? (
            <div className="mt-8 p-12 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun mentor disponible</h3>
              <p className="text-gray-500">Nous ajoutons constamment de nouveaux experts à notre réseau. Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialMentors.map(mentor => (
                <EspaceMentorCard 
                  key={mentor.id} 
                mentor={mentor} 
                onBook={handleBookClick}
              />
            ))}
          </div>
          )}
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mentor={selectedMentor}
        startupId={startupId}
      />
    </div>
  );
}
