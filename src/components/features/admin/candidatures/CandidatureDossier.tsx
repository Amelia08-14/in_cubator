"use client";

import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import Image from "next/image";

interface CandidatureDossierProps {
  candidature: any;
}

export default function CandidatureDossier({ candidature }: CandidatureDossierProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
        <FileText size={18} className="text-[#47295C]" />
        <h2 className="text-sm font-bold text-gray-900">A. Le Dossier (réponses du fondateur)</h2>
      </div>

      <div className="p-6 flex flex-col gap-8">
        
        {/* Pitch Deck */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 mb-3">Pitch Deck</h3>
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50/50">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
              PDF
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{candidature.name}_PitchDeck.pdf</p>
              <p className="text-[11px] text-gray-500">Document non fourni (test)</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              <button disabled className="opacity-50 cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                <Download size={14} />
              </button>
              <button disabled className="opacity-50 cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                <Eye size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Flex Rows */}
        <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h3 className="text-[11px] font-bold text-gray-900 w-32 shrink-0">Secteur</h3>
            <span className="text-xs font-bold text-purple-600 bg-[#f1edfa] px-2.5 py-1 rounded-md border border-[#eaddf7]">{candidature.sector}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h3 className="text-[11px] font-bold text-gray-900 w-32 shrink-0">Type de candidature</h3>
            <span className="text-xs font-bold text-[#47295C] bg-white px-2.5 py-1 rounded-md border border-gray-200">{candidature.type}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <h3 className="text-[11px] font-bold text-gray-900 w-32 shrink-0 mt-0.5">Porteur de projet</h3>
            <div>
              <p className="text-xs font-medium text-gray-900">{candidature.founder}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{candidature.founderEmail}</p>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="flex flex-col gap-6">
          
          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Problème identifié & Solution</h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {candidature.raw.reponses?.problemSolved || "Non spécifié."}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Description du projet</h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {candidature.raw.startup.description || "Non spécifiée."}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Slogan</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {candidature.raw.reponses?.slogan || "Aucun slogan."}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Stade actuel</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {candidature.raw.startup.stade}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Équipe</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {candidature.raw.startup.membres?.length || 0} membres inscrits.
            </p>
            <ul className="mt-2 space-y-1">
              {candidature.raw.startup.membres?.map((m: any) => (
                <li key={m.id} className="text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">{m.nom}</span> — {m.role}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">Besoins</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {Array.isArray(candidature.raw.startup.besoins) && candidature.raw.startup.besoins.length > 0 ? candidature.raw.startup.besoins.join(", ") : "Non spécifiés."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 mb-2">Pays</h3>
              <p className="text-xs text-gray-600">
                {candidature.raw.reponses?.country || "Non spécifié."}
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 mb-2">Site web / Réseaux</h3>
              <p className="text-xs text-blue-600 hover:underline">
                {candidature.raw.reponses?.website ? (
                  <a href={candidature.raw.reponses.website} target="_blank" rel="noreferrer">
                    {candidature.raw.reponses.website}
                  </a>
                ) : "Non spécifié."}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
