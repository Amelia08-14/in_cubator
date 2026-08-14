import React from "react";
import { FolderOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DealRoomIndexPage() {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Top Header Section */}
      <header className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-400 flex items-center gap-2">
            Espace Investisseur <span className="text-sm font-normal mx-1">&gt;</span> <span className="text-[#47295C]">Deal Room</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-5 lg:p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-[#f1edfa] rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={32} className="text-[#47295C]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sélectionnez une Deal Room</h2>
          <p className="text-sm text-gray-500 mb-6">
            Pour accéder à une Deal Room, veuillez sélectionner une startup depuis votre tableau de bord ou votre Watchlist.
          </p>
          <Link 
            href="/espace-investisseur/watchlist"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#47295C] text-white rounded-xl text-sm font-bold shadow-md shadow-[#47295C]/20 hover:bg-[#5a3875] transition-colors"
          >
            Aller à ma Watchlist
          </Link>
        </div>
      </div>
    </div>
  );
}
