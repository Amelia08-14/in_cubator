import React from "react";
import InvestorPreferencesForm from "@/components/features/espace-investisseur/preferences/InvestorPreferencesForm";
import { Bell, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InvestorPreferencesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await prisma.investorProfile.findUnique({
    where: { userId: session.user.id }
  });

  // Default empty profile structure if not found (though it should be created at signup)
  const initialData = profile || {
    organisation: "",
    typeInvestisseur: "Venture Capital (VC)",
    siteWeb: "",
    bio: "",
    secteursCibles: ["HealthTech", "MedTech", "Biotech", "AgriTech", "Entrepreneuriat féminin"],
    stadesCibles: ["pre-seed", "seed", "serie-a"],
    ticketMin: 50000,
    ticketMax: 250000,
    zoneGeographique: "Afrique du Nord",
    emailAlerts: true,
    watchlistAlerts: true,
    logoUrl: ""
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      {/* Top Header Section */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-[#47295C]">Mes Préférences d'Investissement</h1>
          <p className="text-xs text-gray-500 mt-0.5">Personnalisez votre profil et vos critères pour recevoir des opportunités parfaitement adaptées à votre thèse.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
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
      <div className="flex-1 p-5 lg:p-8">
        <InvestorPreferencesForm initialData={initialData} />
      </div>
    </div>
  );
}
