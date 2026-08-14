import React from "react";
import AdminKPIs from "@/components/features/admin/AdminKPIs";
import StartupComparisonModule from "@/components/features/admin/StartupComparisonModule";
import AdminAlertsCenter from "@/components/features/admin/AdminAlertsCenter";
import { Download, Calendar, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function AdminDashboardPage() {
  const [candidaturesCount, startupsCount, mentorsCount, rawStartups] = await Promise.all([
    prisma.candidature.count({ where: { statut: 'SOUMISE' } }),
    prisma.startupProfile.count(),
    prisma.mentorProfile.count({ where: { actif: true } }),
    prisma.startupProfile.findMany({
      include: {
        candidature: true,
        objectifs: {
          include: { taches: true }
        }
      },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const mappedStartups = rawStartups.map((s, index) => {
    // Calculate objective progress
    const totalTaches = s.objectifs.reduce((acc, obj) => acc + obj.taches.length, 0);
    const completedTaches = s.objectifs.reduce((acc, obj) => acc + obj.taches.filter(t => t.statut === 'TERMINE').length, 0);
    const objRatio = totalTaches > 0 ? Math.round((completedTaches / totalTaches) * 100) : 0;
    
    // Progress can be derived from candidature score if tasks are empty for mock purposes
    const progress = totalTaches > 0 ? objRatio : (s.candidature?.score || 0);

    // Safely cast the Prisma JsonValue to string array
    const secteursArray = Array.isArray(s.secteurs) ? (s.secteurs as string[]) : [];
    const sector = secteursArray.length > 0 ? secteursArray[0] : "Général";

    return {
      id: s.id,
      rank: index + 1,
      name: s.nom,
      sector: sector,
      stage: s.stade.replace('_', ' '),
      progress: progress,
      objectives: `${completedTaches} / ${totalTaches > 0 ? totalTaches : 5}`,
      objRatio: totalTaches > 0 ? objRatio : (s.candidature?.score || 0),
    };
  });

  const alertsData = [];
  if (candidaturesCount > 0) {
    alertsData.push({
      id: 1,
      type: "urgent",
      label: "Urgent",
      message: `${candidaturesCount} candidatures nécessitent une évaluation.`,
      time: "Maintenant",
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    });
  }
  
  if (startupsCount === 0) {
    alertsData.push({
      id: 2,
      type: "info",
      label: "Info",
      message: "Aucune startup n'est actuellement inscrite.",
      time: "Maintenant",
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
    });
  }

  // Fallback if no alerts to maintain design structure
  if (alertsData.length === 0) {
    alertsData.push({
      id: 3,
      type: "info",
      label: "Info",
      message: "Aucune alerte récente. L'écosystème fonctionne parfaitement.",
      time: "Aujourd'hui",
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
    });
  }

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de l'écosystème et des indicateurs clés de l'incubateur.</p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-sm">
            <Calendar size={14} className="text-gray-400" />
            Période : 30 derniers jours
            <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#47295C] hover:bg-[#5a3875] text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-[#47295C]/20">
            <Download size={14} />
            Exporter le rapport (PDF/Excel)
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <AdminKPIs 
          candidaturesCount={candidaturesCount}
          startupsCount={startupsCount}
          mentorsCount={mentorsCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
            <StartupComparisonModule startups={mappedStartups} />
          </div>
          
          <div className="lg:col-span-1 xl:col-span-1">
            <AdminAlertsCenter alerts={alertsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
