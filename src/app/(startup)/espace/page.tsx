import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AIRecommendationsWidget from "@/components/features/espace/AIRecommendationsWidget";
import DocumentsWidget from "@/components/features/espace/DocumentsWidget";
import RoadmapClientWidget from "@/components/features/espace/RoadmapClientWidget";


export default async function EspaceDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  // Fetch this user's startup profile with related data
  const startupProfile = await prisma.startupProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      objectifs: {
        include: { taches: true },
      },
      documents: true,
      candidature: true,
      cohorte: true,
    },
  });

  // If no startup profile exists for this user, show a message
  if (!startupProfile) {
    return (
      <div className="flex flex-col min-h-screen pb-12">
        <header className="bg-white px-8 py-6 border-b border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-[#47295C]">
            Bienvenue ! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Votre profil startup n&apos;a pas encore été configuré.
          </p>
        </header>
        <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Aucun profil startup trouvé pour votre compte.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if candidature is accepted
  if (startupProfile.candidature?.statut !== "ACCEPTEE") {
    return (
      <div className="flex flex-col min-h-screen pb-12 bg-gray-50">
        <header className="bg-white px-8 py-6 border-b border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#47295C]">
              Candidature en cours de traitement
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Votre dossier est actuellement entre les mains de notre comité d'évaluation.
            </p>
          </div>
          <span className="px-4 py-1.5 bg-orange-100 text-orange-700 font-bold text-xs rounded-full border border-orange-200">
            {startupProfile.candidature?.statut === "SOUMISE" ? "Soumise" : "En cours d'évaluation"}
          </span>
        </header>
        <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#47295C]/10 text-[#47295C] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Un peu de patience...</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Votre candidature pour la cohorte est en cours d'examen. Dès que notre équipe aura rendu sa décision, vous recevrez une notification par email et votre espace de travail sera débloqué.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-left">
              <div className="text-blue-500 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-blue-800 font-medium leading-relaxed">
                Le délai de traitement est généralement de 48 à 72 heures ouvrées. Assurez-vous de surveiller votre boîte mail !
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-12">
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Top Row - Roadmap & Tasks taking full width or most of it */}
          <div className="lg:col-span-12">
            <RoadmapClientWidget startupId={startupProfile.id} />
          </div>

          {/* Bottom Row */}
          <div className="lg:col-span-7">
            <AIRecommendationsWidget />
          </div>
          <div className="lg:col-span-5">
            <DocumentsWidget initialDocuments={startupProfile.documents.map(d => ({
              id: d.id,
              name: d.fichierUrl.split('/').pop() || "Document",
              date: d.createdAt.toLocaleDateString("fr-FR"),
              type: d.fichierUrl.endsWith('.pdf') ? "pdf" : d.fichierUrl.endsWith('.xls') || d.fichierUrl.endsWith('.xlsx') ? "excel" : "word",
              visibleToInvestors: d.visibleInvestisseurs,
              startupId: startupProfile.id,
              url: d.fichierUrl
            }))} />
          </div>

        </div>
      </div>
    </div>
  );
}
