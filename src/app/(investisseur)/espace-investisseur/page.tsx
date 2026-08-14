import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DealEngine from "@/components/features/espace-investisseur/DealEngine";
import RecommendedStartups from "@/components/features/espace-investisseur/RecommendedStartups";
import StartupDealFlowGrid from "@/components/features/espace-investisseur/StartupDealFlowGrid";
import { Bookmark, Bell, ChevronDown } from "lucide-react";

// Helper function to map DB startup to UI startup format
function mapStartupData(dbStartup: any) {
  let sector = "Non spécifié";
  if (dbStartup.secteurs && Array.isArray(dbStartup.secteurs) && dbStartup.secteurs.length > 0) {
    sector = dbStartup.secteurs[0] as string;
  }

  return {
    id: dbStartup.id,
    name: dbStartup.nom,
    logo: dbStartup.logoUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80",
    description: dbStartup.description,
    sector: sector,
    stage: dbStartup.stade,
    raised: (Math.floor(Math.random() * 5) + 1) + "00k DZD", // Mock raised data
  };
}

export default async function EspaceInvestisseurPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  // Fetch this investor's profile
  const investorProfile = await prisma.investorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      watchlists: true,
      accesDealRoom: true,
    },
  });

  const userName = session.user.email?.split("@")[0] || "Investisseur";
  const initials = userName.substring(0, 2).toUpperCase();

  // 1. Fetch all public startups
  const dbStartups = await prisma.startupProfile.findMany({
    where: { visiblePublic: true },
    orderBy: { createdAt: 'desc' }
  });

  const allStartups = dbStartups.map(mapStartupData);

  // 2. Simple matching algorithm for recommendations
  let recommendedStartups: any[] = [];
  
  if (investorProfile && investorProfile.secteursCibles && Array.isArray(investorProfile.secteursCibles)) {
    const investorSectors = investorProfile.secteursCibles as string[];
    
    // Find startups that share at least one sector
    const matchedStartups = dbStartups.filter(startup => {
      if (startup.secteurs && Array.isArray(startup.secteurs)) {
        return (startup.secteurs as string[]).some(s => investorSectors.includes(s));
      }
      return false;
    });

    // Take top 3
    recommendedStartups = matchedStartups.slice(0, 3).map(mapStartupData);
  }
  
  // Fallback if no matches
  if (recommendedStartups.length === 0) {
    recommendedStartups = allStartups.slice(0, 3);
  }

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#47295C] flex items-center gap-2">
            Explorer les startups
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Trouvez les meilleures opportunités d&apos;investissement selon votre thèse.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#eaddf7] rounded-lg text-xs font-bold text-[#47295C] hover:bg-[#f8f5ff] transition-all shadow-sm">
            <Bookmark size={14} />
            Enregistrer ma recherche
          </button>
          
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={16} />
          </button>
          
          <div className="flex items-center gap-2 p-1 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-xs border border-[#eaddf7]">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-5 lg:p-6">
        <div className="max-w-[1600px] mx-auto min-w-0 w-full overflow-hidden space-y-8">
          
          {/* Access Requests Section */}
          {investorProfile?.accesDealRoom && investorProfile.accesDealRoom.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Mes accès Deal Room</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investorProfile.accesDealRoom.map(access => (
                  <div key={access.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Startup ID: {access.startupId.substring(0,6)}...</h4>
                      <p className="text-xs text-gray-500">Statut: <span className="font-semibold">{access.statut}</span></p>
                    </div>
                    {access.statut === 'ACCORDE' && (
                      <Link href={`/espace-investisseur/deal-room/${access.startupId}`} className="text-xs font-bold text-[#47295C] bg-[#f8f5ff] px-3 py-1.5 rounded-lg border border-[#eaddf7] hover:bg-[#eaddf7] transition-colors">
                        Voir Deal Room
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main content flow */}
          <DealEngine />
          <RecommendedStartups initialData={recommendedStartups} />
          <StartupDealFlowGrid initialData={allStartups} />
        </div>
      </div>
    </div>
  );
}
