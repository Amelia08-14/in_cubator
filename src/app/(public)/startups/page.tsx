import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, MapPin, Target } from "lucide-react";


export default async function PublicStartupsDirectory() {
  const startups = await prisma.startupProfile.findMany({
    where: { visiblePublic: true },
    include: {
      user: true, // We might need email?
    },
    orderBy: { nom: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Découvrez nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#47295C] to-[#964594]">startups incubées</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez les projets innovants qui façonnent l'avenir et connectez-vous avec leurs fondateurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startups.map((startup) => {
            const secteurs = Array.isArray(startup.secteurs) ? startup.secteurs as string[] : [];
            
            return (
              <Link 
                href={`/startups/${startup.id}`} 
                key={startup.id}
                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.nom} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#47295C]/20">
                      <Target size={64} />
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{startup.nom}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                    {startup.pitchResume || "Aucune description fournie pour le moment."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {secteurs.slice(0, 3).map((secteur, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                        {secteur}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm font-bold text-[#47295C] group-hover:text-[#964594] transition-colors mt-auto">
                    Voir le profil détaillé 
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {startups.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Aucune startup publique</h3>
            <p className="text-gray-500 mt-2">Notre annuaire est en cours de mise à jour.</p>
          </div>
        )}

      </div>
    </div>
  );
}
