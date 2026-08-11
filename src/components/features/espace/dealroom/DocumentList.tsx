"use client";

import React, { useState } from "react";
import { Search, ChevronDown, MoreVertical, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface DealRoomDocument {
  id: string;
  name: string;
  type: string;
  typeClass: string;
  date: string;
  isPublished: boolean;
  fileExtension: "pdf" | "xlsx" | "docx";
}

const mockDocuments: DealRoomDocument[] = [
  {
    id: "1",
    name: "Pitch Deck 2026.pdf",
    type: "Pitch Deck",
    typeClass: "text-purple-600 bg-purple-50",
    date: "22 mai 2026 à 14:32",
    isPublished: true,
    fileExtension: "pdf"
  },
  {
    id: "2",
    name: "Business Plan.xlsx",
    type: "Business Plan",
    typeClass: "text-blue-600 bg-blue-50",
    date: "20 mai 2026 à 09:15",
    isPublished: true,
    fileExtension: "xlsx"
  },
  {
    id: "3",
    name: "Bilan Financier 2023.pdf",
    type: "Bilan Financier",
    typeClass: "text-orange-600 bg-orange-50",
    date: "18 mai 2026 à 16:45",
    isPublished: false,
    fileExtension: "pdf"
  },
  {
    id: "4",
    name: "Cap Table - Q2 2026.docx",
    type: "Cap Table",
    typeClass: "text-green-600 bg-green-50",
    date: "15 mai 2026 à 11:20",
    isPublished: true,
    fileExtension: "docx"
  },
  {
    id: "5",
    name: "Prévisions Financières 3 ans.pdf",
    type: "Finances",
    typeClass: "text-yellow-600 bg-yellow-50",
    date: "12 mai 2026 à 10:05",
    isPublished: false,
    fileExtension: "pdf"
  },
  {
    id: "6",
    name: "Budget Prévisionnel 2026.xlsx",
    type: "Finances",
    typeClass: "text-yellow-600 bg-yellow-50",
    date: "10 mai 2026 à 13:18",
    isPublished: false,
    fileExtension: "xlsx"
  },
  {
    id: "7",
    name: "Contrat NDA - Modèle.pdf",
    type: "Juridique",
    typeClass: "text-gray-600 bg-gray-50",
    date: "8 mai 2026 à 15:40",
    isPublished: true,
    fileExtension: "pdf"
  },
  {
    id: "8",
    name: "Présentation Produit.docx",
    type: "Produit",
    typeClass: "text-blue-600 bg-blue-50",
    date: "5 mai 2026 à 09:00",
    isPublished: true,
    fileExtension: "docx"
  }
];

export default function DocumentList() {
  const [documents, setDocuments] = useState<DealRoomDocument[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleVisibility = (id: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === id ? { ...doc, isPublished: !doc.isPublished } : doc
    ));
  };

  const getFileIcon = (ext: string) => {
    switch (ext) {
      case "pdf": return <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[8px] font-bold bg-red-500 shrink-0">PDF</div>;
      case "xlsx": return <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[8px] font-bold bg-green-500 shrink-0">XLS</div>;
      case "docx": return <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[8px] font-bold bg-blue-500 shrink-0">DOC</div>;
      default: return <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[8px] font-bold bg-gray-500 shrink-0">FILE</div>;
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-[#47295C]">Documents dans votre Deal Room</h2>
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
            {filteredDocuments.length} fichiers
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#964594]/30 focus:border-[#964594] bg-white"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          </div>
          <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-gray-300 min-w-[100px]">
            Trier par
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500">Nom du fichier</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500">Date d'ajout</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 text-center">Visible aux investisseurs</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.fileExtension)}
                      <span className="font-medium text-sm text-gray-700">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap ${doc.typeClass}`}>
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-500">
                    {doc.date}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <Switch 
                        checked={doc.isPublished}
                        onCheckedChange={() => toggleVisibility(doc.id)}
                      />
                      <span className={`text-xs font-medium w-12 ${doc.isPublished ? 'text-[#47295C]' : 'text-gray-400'}`}>
                        {doc.isPublished ? 'Publié' : 'Privé'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors inline-flex">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                    Aucun document ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Alert Footer */}
      <div className="mt-8 bg-[#FDF9FE] border border-[#964594]/20 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-white border border-[#964594]/20 flex items-center justify-center text-[#964594] shrink-0 shadow-sm">
            <ShieldCheck size={20} strokeWidth={2} />
          </div>
          <div>
            <h4 className="font-bold text-[#47295C] text-sm">Vos documents sont stockés de manière sécurisée.</h4>
            <p className="text-xs text-gray-500 mt-0.5">Seuls les investisseurs accrédités autorisés pourront y accéder lorsque le document est publié.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-[#964594] hover:text-[#47295C] transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0">
          En savoir plus sur la sécurité
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </button>
      </div>

    </div>
  );
}
