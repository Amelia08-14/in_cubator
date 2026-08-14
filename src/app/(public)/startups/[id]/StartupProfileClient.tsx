"use client";

import React, { useState } from "react";
import { Lock, Loader2, CheckCircle } from "lucide-react";

interface Props {
  startupId: string;
  nom: string;
  pitchResume: string;
  logoUrl: string | null;
  secteurs: string[];
  isInvestor: boolean;
  hasRequestedAccess: boolean;
}

export default function StartupProfileClient({ 
  startupId, nom, pitchResume, logoUrl, secteurs, isInvestor, hasRequestedAccess 
}: Props) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">(
    hasRequestedAccess ? "SUCCESS" : "IDLE"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestAccess = async () => {
    if (!isInvestor) {
      alert("Seuls les investisseurs connectés peuvent demander l'accès à la Deal Room.");
      return;
    }

    setIsRequesting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/deal-room/acces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId })
      });
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        if (json.error?.code === 'CONFLICT') {
          setRequestStatus("SUCCESS");
        } else {
          setErrorMsg(json.error?.message || "Erreur lors de la demande.");
        }
      } else {
        setRequestStatus("SUCCESS");
      }
    } catch (err) {
      setErrorMsg("Une erreur est survenue.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
            <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-inner">
              {logoUrl ? (
                <img src={logoUrl} alt={nom} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-gray-300">{nom.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{nom}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {secteurs.map((secteur, i) => (
                  <span key={i} className="px-3 py-1 bg-[#47295C]/10 text-[#47295C] rounded-full text-xs font-bold">
                    {secteur}
                  </span>
                ))}
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {pitchResume || "Aucune description fournie."}
              </p>
            </div>
          </div>
        </div>

        {/* Deal Room Access Action */}
        <div className="bg-gradient-to-br from-[#47295C] to-[#2b10ac] rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Lock className="text-[#964594]" /> 
              Deal Room Privée
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-2">
              Accédez au Pitch Deck, Business Plan, KPIs et informations financières de {nom}.
            </p>
            {!isInvestor && (
              <p className="text-[#964594] text-sm font-bold bg-[#964594]/20 inline-block px-3 py-1 rounded">
                Réservé aux investisseurs inscrits.
              </p>
            )}
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            {requestStatus === "SUCCESS" ? (
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-center gap-3 w-full">
                <CheckCircle className="text-green-400" />
                <span className="font-bold text-white">Demande envoyée</span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <button 
                  onClick={handleRequestAccess}
                  disabled={isRequesting || !isInvestor}
                  className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                    !isInvestor ? "bg-white/20 text-white/50 cursor-not-allowed" :
                    isRequesting ? "bg-white text-[#47295C] opacity-80 cursor-wait" : "bg-white text-[#47295C] hover:bg-gray-50 hover:scale-105"
                  }`}
                >
                  {isRequesting ? <Loader2 className="animate-spin" /> : null}
                  Demander l'accès
                </button>
                {errorMsg && (
                  <p className="text-red-300 text-sm font-medium mt-2">{errorMsg}</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
