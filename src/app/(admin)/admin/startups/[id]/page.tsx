import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2 } from "lucide-react";
import AdminStartupRoadmap from "@/components/features/admin/startups/AdminStartupRoadmap";
import AdminStartupDocuments from "@/components/features/admin/startups/AdminStartupDocuments";


export default async function AdminStartupDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "GESTIONNAIRE")) {
    redirect("/admin/connexion");
  }
  
  const { id } = await params;

  const startup = await prisma.startupProfile.findUnique({
    where: { id },
    include: {
      user: true,
      cohorte: true
    }
  });

  if (!startup) {
    redirect("/admin/startups");
  }

  const objectifsRaw = await prisma.objectif.findMany({
    where: { startupId: id },
    include: { taches: true }
  });

  // Serialization for Client Component
  const objectifs = objectifsRaw.map(obj => ({
    id: obj.id,
    titre: obj.titre,
    description: obj.description,
    dateEcheance: obj.dateEcheance?.toISOString() || null,
    statut: obj.statut,
    taches: obj.taches.map(t => ({
      id: t.id,
      titre: t.titre,
      statut: t.statut,
      dateEcheance: t.dateEcheance?.toISOString() || null
    }))
  }));

  const documentsRaw = await prisma.document.findMany({
    where: { startupId: id },
    orderBy: { createdAt: "desc" }
  });

  const documents = documentsRaw.map(d => ({
    id: d.id,
    nom: d.fichierUrl.split('/').pop() || "Document",
    date: d.createdAt.toLocaleDateString("fr-FR"),
    url: d.fichierUrl
  }));

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col gap-4 shadow-sm sticky top-0 z-20">
        <Link href="/admin/startups" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#3719CA]">
          <ChevronLeft size={16} />
          Retour aux startups
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{startup.nom}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Cohorte: {startup.cohorte?.nom || "Non assigné"} • Compte: {startup.user?.email}
            </p>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1000px] w-full">
        <AdminStartupRoadmap startupId={id} initialObjectifs={objectifs} />
        <AdminStartupDocuments startupId={id} initialDocuments={documents} />
      </div>
    </div>
  );
}
