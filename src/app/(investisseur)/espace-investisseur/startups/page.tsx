import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import RequestAccessButton from "./RequestAccessButton";


export default async function InvestorStartupVitrine() {
  const session = await auth();
  if (!session?.user) return null;

  const investor = await prisma.investorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!investor) {
    return <div className="p-8 text-center text-gray-500">Profil investisseur non trouvé.</div>;
  }

  // Get all startups that are visible to the public
  const startups = await prisma.startupProfile.findMany({
    where: { visiblePublic: true },
    include: {
      user: true,
      accesDealRoom: {
        where: { investisseurId: investor.id }
      }
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-12">
      <header className="bg-white px-8 py-6 border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-[#47295C]">Vitrine des Startups</h1>
        <p className="text-sm text-gray-500 mt-1">Découvrez les startups de l'incubateur et demandez l'accès à leur Deal Room.</p>
      </header>

      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {startups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            Aucune startup publique pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {startups.map((startup) => {
              const accessRequest = startup.accesDealRoom[0];
              const sectors = Array.isArray(startup.secteurs) ? startup.secteurs : [];

              return (
                <div key={startup.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#47295C] flex items-center justify-center shrink-0">
                        {startup.logoUrl ? (
                          <img src={startup.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Building2 size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{startup.nom}</h3>
                        <p className="text-xs text-gray-500">{startup.stade.replace("_", " ")}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {sectors.map((s: any, idx: number) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {startup.pitchResume || startup.description || "Aucune description fournie."}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    {accessRequest ? (
                      accessRequest.statut === 'ACCORDE' ? (
                        <Link href={`/espace-investisseur/deal-room/${startup.id}`} className="flex items-center justify-center gap-2 w-full bg-emerald-50 text-emerald-700 font-bold py-2 rounded-xl text-sm border border-emerald-200 hover:bg-emerald-100 transition-colors">
                          Voir la Deal Room
                          <ArrowRight size={16} />
                        </Link>
                      ) : accessRequest.statut === 'DEMANDE' ? (
                        <button disabled className="w-full bg-yellow-50 text-yellow-700 font-bold py-2 rounded-xl text-sm border border-yellow-200 cursor-not-allowed">
                          Demande en attente...
                        </button>
                      ) : (
                        <button disabled className="w-full bg-red-50 text-red-600 font-bold py-2 rounded-xl text-sm border border-red-200 cursor-not-allowed">
                          Accès refusé
                        </button>
                      )
                    ) : (
                      <RequestAccessButton startupId={startup.id} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
