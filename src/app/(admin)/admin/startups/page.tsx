import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Target, ChevronRight } from "lucide-react";


export default async function AdminStartupsPage() {
  const session = await auth("admin");
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "GESTIONNAIRE")) {
    redirect("/admin/connexion");
  }

  const startups = await prisma.startupProfile.findMany({
    include: {
      user: true,
      cohorte: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-[#3719CA]" />
            Gestion des Startups
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les informations, la roadmap et les objectifs de chaque startup.
          </p>
        </div>
      </header>

      <div className="p-8 max-w-[1600px] mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500">Startup</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500">Secteurs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500">Stade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {startups.map((startup) => (
                <tr key={startup.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{startup.nom}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{startup.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-1">
                      {startup.secteurs && Array.isArray(startup.secteurs) ? startup.secteurs.map((secteur: any, i: any) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {secteur}
                        </span>
                      )) : <span className="text-gray-400 text-[10px]">Aucun secteur</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
                      {startup.stade.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/startups/${startup.id}`}
                      className="inline-flex items-center gap-1 text-[#3719CA] hover:text-[#2b10ac] text-sm font-bold"
                    >
                      Gérer la roadmap
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              
              {startups.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Aucune startup trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
