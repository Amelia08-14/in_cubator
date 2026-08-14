
import React from "react";
import Link from "next/link";
import { ChevronLeft, FileDown } from "lucide-react";
import CandidatureDossier from "@/components/features/admin/candidatures/CandidatureDossier";
import CandidatureDecisionForm from "@/components/features/admin/candidatures/CandidatureDecisionForm";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


export default async function CandidatureEvaluationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: {
      startup: {
        include: {
          user: true,
          membres: true
        }
      }
    }
  });

  if (!candidature) {
    notFound();
  }

  let status = "En attente";
  if (candidature.statut === "EN_EVALUATION") status = "Évalué";
  if (candidature.statut === "ACCEPTEE") status = "Accepté";
  if (candidature.statut === "REFUSEE") status = "Refusé";
  if (candidature.statut === "LISTE_ATTENTE") status = "Liste d'attente";

  const dateObj = new Date(candidature.createdAt);
  const dateStr = dateObj.toLocaleDateString('fr-FR') + ' à ' + dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  let sectorStr = "Non défini";
  if (Array.isArray(candidature.startup.secteurs) && candidature.startup.secteurs.length > 0) {
    sectorStr = String(candidature.startup.secteurs[0]);
  }

  const mappedCandidature = {
    id: candidature.id,
    name: candidature.startup.nom,
    status: status,
    submissionDate: dateStr,
    founder: candidature.startup.nom,
    founderEmail: candidature.startup.user.email,
    type: "Candidature standard",
    sector: sectorStr,
    raw: candidature
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] pb-12">
      
      {/* Top Header Navigation */}
      <div className="bg-white px-8 py-4 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        
        <Link 
          href="/admin/candidatures"
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#47295C] transition-colors bg-gray-50 hover:bg-[#f1edfa] px-3 py-1.5 rounded-lg border border-gray-200"
        >
          <ChevronLeft size={14} />
          Retour aux candidatures
        </Link>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#47295C] hover:bg-[#5a3875] text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-[#47295C]/20">
          <FileDown size={14} />
          Générer le rapport PDF
        </button>

      </div>

      {/* Main Content Area */}
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Startup Identity Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
            {/* Logo placeholder */}
            <svg className="w-8 h-8 text-[#47295C]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{mappedCandidature.name}</h1>
              <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md text-[10px] font-bold border border-yellow-100">
                {mappedCandidature.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Candidature soumise le {mappedCandidature.submissionDate}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              ID Candidature : {mappedCandidature.id}
            </p>
          </div>
        </div>

        {/* Single Column Layout */}
        <div className="flex flex-col gap-8 items-stretch">
          
          {/* Top Section: Dossier */}
          <div className="w-full">
            <CandidatureDossier candidature={mappedCandidature} />
          </div>

          {/* Bottom Section: Decision */}
          <div className="w-full">
            <CandidatureDecisionForm candidature={mappedCandidature} />
          </div>

        </div>

      </div>
    </div>
  );
}
