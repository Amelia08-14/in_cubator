import React from "react";
import PortfolioKPIs from "@/components/features/espace-investisseur/portefeuille/PortfolioKPIs";
import PortfolioTable from "@/components/features/espace-investisseur/portefeuille/PortfolioTable";
import { Download, Bell, ChevronDown, Briefcase } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Wallet, Rocket, FileText, TrendingUp } from "lucide-react";

export default async function PortfolioPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the investor profile
  const investorProfile = await prisma.investorProfile.findUnique({
    where: { userId: session.user.id }
  });

  let portfolioData: any[] = [];
  let kpisData: any[] = [];

  if (investorProfile) {
    // We use AccesDealRoom with status ACCORDE as a proxy for the portfolio
    const accessRecords = await prisma.accesDealRoom.findMany({
      where: { 
        investisseurId: investorProfile.id,
        statut: 'ACCORDE'
      },
      include: {
        startup: true
      },
      orderBy: { dateAcces: 'desc' }
    });

    let totalInvested = 0;
    
    portfolioData = accessRecords.map((access, index) => {
      const startup = access.startup;
      // Extract first sector or use default
      let sector = "Non spécifié";
      if (startup.secteurs && Array.isArray(startup.secteurs) && startup.secteurs.length > 0) {
        sector = startup.secteurs[0] as string;
      }

      // Mock financial data based on index/id for consistency in demo
      const amount = 100000 + (index * 50000); 
      totalInvested += amount;

      return {
        id: startup.id,
        name: startup.nom,
        description: startup.description,
        logo: startup.logoUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80",
        sector: sector,
        stage: startup.stade,
        date: access.dateAcces ? access.dateAcces.toLocaleDateString('fr-FR') : "Récemment",
        amount: amount.toLocaleString('fr-FR') + " DZD",
        equity: (5 + (index * 2)) + ".0%",
        report: { name: "Rapport T3", date: new Date().toLocaleDateString('fr-FR'), type: "pdf" }
      };
    });

    const activeStartups = portfolioData.length;
    const estimatedValuation = totalInvested * 2.5; // Mock valuation

    kpisData = [
      {
        id: 1,
        title: "Capital Déployé",
        value: totalInvested > 0 ? totalInvested.toLocaleString('fr-FR') + " DZD" : "0 DZD",
        subtitle: `Total investi dans ${activeStartups} startups`,
        iconType: "wallet",
        iconBg: "bg-[#f1edfa]",
        chartColor: "stroke-[#47295C]",
      },
      {
        id: 2,
        title: "Startups Actives",
        value: activeStartups.toString(),
        subtitle: `Sur ${activeStartups} investissements totaux`,
        iconType: "rocket",
        iconBg: "bg-green-50",
        chartColor: "stroke-green-400",
      },
      {
        id: 3,
        title: "Dernières Nouvelles",
        value: activeStartups > 0 ? "2" : "0",
        subtitle: "Rapports trimestriels non lus",
        iconType: "filetext",
        iconBg: "bg-orange-50",
        chartColor: "stroke-orange-300",
      },
      {
        id: 4,
        title: "Valorisation Estimée",
        value: estimatedValuation > 0 ? estimatedValuation.toLocaleString('fr-FR') + " DZD" : "0 DZD",
        subtitle: "Valorisation totale du portefeuille",
        iconType: "trending",
        iconBg: "bg-blue-50",
        chartColor: "stroke-blue-300",
      }
    ];
  }

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#47295C] flex items-center gap-2">
            Mon Portefeuille <Briefcase size={20} className="text-[#47295C]" />
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Suivez la performance et l'évolution des startups dans lesquelles vous avez investi.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#eaddf7] rounded-lg text-xs font-bold text-[#47295C] hover:bg-[#f8f5ff] transition-all shadow-sm">
            <Download size={14} />
            Exporter le portefeuille
          </button>
          
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={16} />
          </button>
          
          <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-xs border border-[#eaddf7]">
              {session?.user?.name?.substring(0,2).toUpperCase() || "AB"}
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-5 lg:p-6">
        <div className="max-w-[1600px] mx-auto min-w-0 w-full overflow-hidden">
          <PortfolioKPIs initialData={kpisData} />
          <PortfolioTable initialData={portfolioData} />
        </div>
      </div>
    </div>
  );
}
