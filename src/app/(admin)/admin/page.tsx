import React from "react";
import AdminKPIs from "@/components/features/admin/AdminKPIs";
import StartupComparisonModule from "@/components/features/admin/StartupComparisonModule";
import AdminAlertsCenter from "@/components/features/admin/AdminAlertsCenter";
import PipelineSummary from "@/components/features/admin/crm/PipelineSummary";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/server-api";
import type { CrmStats } from "@/lib/crm/types";

export const dynamic = "force-dynamic";


export default async function AdminDashboardPage() {
  const [crmStats, candidaturesCount, startupsCount, mentorsCount, rawStartups] = await Promise.all([
    // Le CRM est un module à part : son indisponibilité ne doit pas casser le tableau de bord.
    adminApi<CrmStats>("/api/crm/stats").catch(() => null),
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
    <div className="flex min-h-screen flex-col pb-10">
      <header className="border-b border-line bg-white px-6 py-5 lg:px-8">
        <h1 className="font-serif text-[1.7rem] font-extrabold leading-tight text-violet-dark">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-main">
          Vue d&apos;ensemble de l&apos;écosystème : candidatures, startups, mentors et pipeline commercial.
        </p>
      </header>

      <div className="mx-auto w-full max-w-[1600px] flex-1 p-6 lg:p-8">
        <AdminKPIs
          candidaturesCount={candidaturesCount}
          startupsCount={startupsCount}
          mentorsCount={mentorsCount}
          openLeads={crmStats?.totals.open ?? null}
        />

        {crmStats && <PipelineSummary stats={crmStats} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col gap-6 lg:col-span-2 xl:col-span-3">
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
