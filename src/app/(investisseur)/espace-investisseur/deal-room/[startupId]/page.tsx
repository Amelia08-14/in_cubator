import React from "react";
import DealRoomHeader from "@/components/features/espace-investisseur/deal-room/DealRoomHeader";
import ReadOnlyDocumentTable from "@/components/features/espace-investisseur/deal-room/ReadOnlyDocumentTable";
import { Bell, ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DealRoomPage({ params }: { params: { startupId: string } }) {
  // In a real app, you would fetch startup data here using params.startupId
  // For the UI demonstration, we assume NovaTech data is loaded

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-400 flex items-center gap-2">
            Espace Investisseur <span className="text-sm font-normal mx-1">&gt;</span> Deal Room <span className="text-sm font-normal mx-1">&gt;</span> <span className="text-[#47295C]">NovaTech</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={16} />
          </button>
          
          <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-xs border border-[#eaddf7]">
              AB
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-5 lg:p-6">
        <div className="max-w-[1600px] mx-auto min-w-0 w-full">
          
          {/* Back Navigation */}
          <Link href="/espace-investisseur/watchlist" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#47295C] transition-colors mb-2">
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>

          {/* Page Flow */}
          <DealRoomHeader />
          <ReadOnlyDocumentTable />
          
        </div>
      </div>
    </div>
  );
}
