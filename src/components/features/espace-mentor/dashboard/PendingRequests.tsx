"use client";

import React, { useState } from "react";
import { ArrowRight, Building2, Calendar as CalendarIcon, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PendingRequests({ requests = [] }: { requests?: any[] }) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, statut: 'CONFIRME' | 'ANNULE') => {
    if (processingId) return;
    setProcessingId(id);

    try {
      const res = await fetch(`/api/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut })
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Une erreur est survenue.");
      }
    } catch (err) {
      alert("Une erreur est survenue.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Demandes en attente</h2>
          <span className="bg-[#f1edfa] text-[#47295C] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{requests.length}</span>
        </div>
        <Link href="#" className="text-sm font-semibold text-[#47295C] hover:text-[#5a3875] flex items-center gap-1 transition-colors">
          Voir tout <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {requests.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Aucune demande en attente.
          </div>
        ) : (
          requests.map((req) => {
            const startupName = req.startup?.nomEntreprise || req.startup?.user?.email?.split('@')[0] || "Startup Inconnue";
            const sectors = req.startup?.secteurs || [];
            const sectorStr = Array.isArray(sectors) ? sectors.join(', ') : (typeof sectors === 'string' ? sectors : 'Non spécifié');
            
            const dateStr = req.disponibilite?.dateDebut ? new Date(req.disponibilite.dateDebut).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' }) : "Date à définir";
            const timeStr = req.disponibilite?.dateDebut ? new Date(req.disponibilite.dateDebut).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : "";

            return (
              <div key={req.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      <Building2 size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{startupName}</h4>
                      <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{sectorStr}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-gray-700 mb-0.5">
                      <CalendarIcon size={12} className="text-gray-400" />
                      {dateStr}
                    </div>
                    {timeStr && <div className="text-[10px] font-semibold text-gray-500">{timeStr}</div>}
                  </div>
                </div>

                <div className="mb-3 flex justify-end">
                  <span className="bg-[#f1edfa] text-[#47295C] px-2.5 py-1 rounded-md text-[10px] font-bold">
                    {req.type === "MENTORAT" ? "Séance de mentorat" : req.type}
                  </span>
                </div>

                {req.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {req.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleUpdate(req.id, 'CONFIRME')}
                    disabled={processingId === req.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {processingId === req.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                    Accepter
                  </button>
                  <button 
                    onClick={() => handleUpdate(req.id, 'ANNULE')}
                    disabled={processingId === req.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {processingId === req.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} strokeWidth={2.5} />}
                    Refuser
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
