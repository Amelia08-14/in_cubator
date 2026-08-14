import React from "react";
import AdminCandidaturesFilters from "@/components/features/admin/AdminCandidaturesFilters";
import AdminCandidaturesTable from "@/components/features/admin/AdminCandidaturesTable";
import { Download, Info } from "lucide-react";

import { prisma } from "@/lib/prisma";


export default async function AdminCandidaturesPage() {
  const dbCandidatures = await prisma.candidature.findMany({
    include: {
      startup: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedCandidatures = dbCandidatures.map((c) => {
    let status = "En attente";
    if (c.statut === "EN_EVALUATION") status = "Évalué";
    if (c.statut === "ACCEPTEE") status = "Accepté";
    if (c.statut === "REFUSEE") status = "Refusé";
    if (c.statut === "LISTE_ATTENTE") status = "Liste d'attente";

    const dateObj = new Date(c.createdAt);
    const dateStr = dateObj.toLocaleDateString('fr-FR');
    const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Handle sectors (it's a JSON array in DB)
    let sectorStr = "Non défini";
    if (Array.isArray(c.startup.secteurs) && c.startup.secteurs.length > 0) {
      sectorStr = String(c.startup.secteurs[0]);
    }

    return {
      id: c.id,
      name: c.startup.nom,
      email: c.startup.user.email,
      founder: c.startup.nom, // Can be improved if we pull team members
      founderEmail: c.startup.user.email,
      type: "Candidature standard",
      challenge: "-",
      sector: sectorStr,
      score: c.score || 0,
      date: dateStr,
      time: timeStr,
      status: status
    };
  });

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Candidatures</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Info size={14} className="text-gray-400" />
            Consultez, filtrez et évaluez les candidatures des startups.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eaddf7] text-[#47295C] hover:bg-[#f1edfa] rounded-lg text-xs font-bold transition-colors shadow-sm">
            <Download size={14} />
            Exporter la liste
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <AdminCandidaturesFilters />
        <AdminCandidaturesTable candidatures={formattedCandidatures} />
      </div>
    </div>
  );
}
