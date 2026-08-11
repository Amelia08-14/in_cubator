"use client";

import React, { useState } from "react";
import Header from "@/components/features/espace/Header";
import { Lock } from "lucide-react";
import UploadZone from "@/components/features/espace/dealroom/UploadZone";
import DocumentList from "@/components/features/espace/dealroom/DocumentList";

export default function DealRoomPage() {
  const [activeTab, setActiveTab] = useState<"mes-documents" | "acces">("mes-documents");

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-[#f8f9fa] relative">
      <Header />
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Deal Room Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#47295C] mb-2 flex items-center gap-2">
              <Lock size={24} className="text-[#964594]" />
              Deal Room
            </h1>
            <p className="text-sm text-gray-500">
              Gérez vos documents sensibles et contrôlez leur visibilité auprès des investisseurs.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button 
              onClick={() => setActiveTab("mes-documents")}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "mes-documents" 
                  ? "border-[#964594] text-[#47295C]" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Mes documents
            </button>
            <button 
              onClick={() => setActiveTab("acces")}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "acces" 
                  ? "border-[#964594] text-[#47295C]" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Accès investisseurs
            </button>
          </div>

          {/* Content */}
          {activeTab === "mes-documents" ? (
            <div>
              <UploadZone />
              <DocumentList />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <h3 className="font-bold text-[#47295C] text-lg mb-2">Accès investisseurs</h3>
              <p className="text-gray-500 text-sm">Fonctionnalité en cours de développement. Vous pourrez bientôt voir qui a consulté vos documents.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
