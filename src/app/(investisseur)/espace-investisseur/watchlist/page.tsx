import React from "react";
import WatchlistTable from "@/components/features/espace-investisseur/WatchlistTable";
import { Lock, Download, Bell, ChevronDown } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function WatchlistPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the investor profile to get its ID
  const investorProfile = await prisma.investorProfile.findUnique({
    where: { userId: session.user.id }
  });

  let watchlistData: any[] = [];

  if (investorProfile) {
    const watchlists = await prisma.watchlist.findMany({
      where: { investisseurId: investorProfile.id },
      include: {
        startup: true
      },
      orderBy: { createdAt: 'desc' }
    });

    watchlistData = watchlists.map((w) => {
      const startup = w.startup;
      // Extract first sector or use default
      let sector = "Non spécifié";
      if (startup.secteurs && Array.isArray(startup.secteurs) && startup.secteurs.length > 0) {
        sector = startup.secteurs[0] as string;
      }

      return {
        id: startup.id,
        name: startup.nom,
        description: startup.description,
        logo: startup.logoUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80",
        sector: sector,
        stage: startup.stade,
        // Mock data for fields not yet in the DB model
        raisedText: "En levée de fonds",
        progress: Math.floor(Math.random() * 100), // Random progress for now
        activity: { title: "Ajouté à la Watchlist", time: w.createdAt.toLocaleDateString('fr-FR'), type: "success" }
      };
    });
  }

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#47295C] flex items-center gap-2">
            Ma Watchlist <Lock size={20} className="text-[#47295C]" />
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Suivez et gérez votre sélection de startups à haut potentiel.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#eaddf7] rounded-lg text-xs font-bold text-[#47295C] hover:bg-[#f8f5ff] transition-all shadow-sm">
            <Download size={14} />
            Exporter la liste
          </button>
          
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={16} />
          </button>
          
          <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-xs border border-[#eaddf7]">
              {session.user.name?.substring(0, 2).toUpperCase() || 'AB'}
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-5 lg:p-6">
        <div className="max-w-[1600px] mx-auto min-w-0 w-full overflow-hidden">
          <WatchlistTable initialData={watchlistData} />
        </div>
      </div>
    </div>
  );
}
