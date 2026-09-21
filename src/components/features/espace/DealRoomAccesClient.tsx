"use client";

import React, { useState } from "react";
import { Check, X, Shield, Clock } from "lucide-react";

interface AccessRequest {
  id: string;
  investisseur: {
    organisation: string | null;
    utilisateur: {
      email: string;
    };
  };
  statut: "DEMANDE" | "ACCORDE" | "REFUSE" | "REVOQUE";
  createdAt: string;
}

interface Props {
  initialRequests: AccessRequest[];
}

export default function DealRoomAccesClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState<AccessRequest[]>(initialRequests);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/deal-room/acces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus })
      });

      if (res.ok) {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, statut: newStatus as any } : req));
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="bg-white px-8 py-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#47295C] flex items-center gap-2">
            <Shield className="text-[#964594]" /> 
            Demandes d'accès
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les investisseurs qui ont demandé à consulter votre Deal Room.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucune demande d'accès pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500">Investisseur</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500">Date de demande</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 text-center">Statut</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(req => {
                  const isDemande = req.statut === "DEMANDE";
                  const date = new Date(req.createdAt).toLocaleDateString("fr-FR");

                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{req.investisseur.organisation || "Investisseur Indépendant"}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{req.investisseur.utilisateur?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {date}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isDemande ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">
                            <Clock size={12} />
                            En attente
                          </span>
                        ) : req.statut === "ACCORDE" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                            <Check size={12} />
                            Accordé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                            <X size={12} />
                            Refusé/Révoqué
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isDemande ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updateStatus(req.id, "REFUSE")}
                              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
                            >
                              Refuser
                            </button>
                            <button 
                              onClick={() => updateStatus(req.id, "ACCORDE")}
                              className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg text-sm font-bold transition-colors shadow-sm"
                            >
                              Accorder l'accès
                            </button>
                          </div>
                        ) : req.statut === "ACCORDE" ? (
                          <button 
                            onClick={() => updateStatus(req.id, "REVOQUE")}
                            className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            Révoquer
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus(req.id, "ACCORDE")}
                            className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            Rétablir l'accès
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
