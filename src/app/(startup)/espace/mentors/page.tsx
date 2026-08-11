"use client";

import React, { useState } from "react";
import Header from "@/components/features/espace/Header";
import { Mentor } from "@/lib/data/mentors";
import EspaceMentorsFilters from "@/components/features/espace/mentors/EspaceMentorsFilters";
import EspaceMentorCard from "@/components/features/espace/mentors/EspaceMentorCard";
import BookingModal from "@/components/features/espace/mentors/BookingModal";

// Extend the mentors data with the ones in the screenshot if they aren't there
const extendedMentorsData: Mentor[] = [
  {
    id: "lina",
    name: "Dr. Lina Merzouk",
    role: "Stratégie & Affaires réglementaires",
    tags: ["MedTech", "Pharma", "Biotech"],
    rating: 4.9,
    reviewCount: 27,
  },
  {
    id: "karim",
    name: "Karim Belkacem",
    role: "Finance & Levée de fonds",
    tags: ["FinTech", "Pharma", "SaaS"],
    rating: 4.8,
    reviewCount: 31,
  },
  {
    id: "doria",
    name: "Doria Ait-Salah",
    role: "Tech & Product",
    tags: ["HealthTech", "AI", "SaaS"],
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: "yacine",
    name: "Yacine Berrada",
    role: "Propriété intellectuelle",
    tags: ["Legal", "MedTech", "Biotech"],
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: "amal",
    name: "Amal Hamdi",
    role: "Marketing & Go-to-Market",
    tags: ["Marketing", "SaaS", "B2B"],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "mehdi",
    name: "Mehdi El Idrissi",
    role: "Opérations & Supply Chain",
    tags: ["Operations", "Pharma", "Industriel"],
    rating: 4.6,
    reviewCount: 16,
  }
];

export default function EspaceMentorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const handleBookClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-[#f8f9fa] relative">
      <Header />
      
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
              {extendedMentorsData.length} mentors disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {extendedMentorsData.map(mentor => (
              <EspaceMentorCard 
                key={mentor.id} 
                mentor={mentor} 
                onBook={handleBookClick}
              />
            ))}
          </div>

        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mentor={selectedMentor}
      />
    </div>
  );
}
