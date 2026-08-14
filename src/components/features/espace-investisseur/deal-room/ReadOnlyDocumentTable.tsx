"use client";

import React from "react";
import { Shield, Clock, Download, Eye, MoreVertical, FileText, FileSpreadsheet, FileIcon } from "lucide-react";

export default function ReadOnlyDocumentTable() {
  const documents = [
    {
      id: "1",
      name: "Pitch_Deck_V3_Final.pdf",
      description: "Présentation de la startup et solution",
      type: "pdf",
      category: "Stratégie",
      date: "12 mai 2024 à 15:42",
      author: "Par Amal H.",
      action: "download"
    },
    {
      id: "2",
      name: "Cap_Table_2026.xlsx",
      description: "Tableau de capitalisation",
      type: "excel",
      category: "Finance",
      date: "11 mai 2024 à 11:28",
      author: "Par Amine B.",
      action: "download"
    },
    {
      id: "3",
      name: "Business_Plan_2024.pdf",
      description: "Plan d'affaires détaillé",
      type: "pdf",
      category: "Finance",
      date: "10 mai 2024 à 18:05",
      author: "Par Doria K.",
      action: "download"
    },
    {
      id: "4",
      name: "Étude_Marché_MedTech.docx",
      description: "Étude de marché et analyse concurrentielle",
      type: "word",
      category: "Stratégie",
      date: "09 mai 2024 à 09:45",
      author: "Par Amal H.",
      action: "view"
    },
    {
      id: "5",
      name: "Roadmap_Produit.pdf",
      description: "Feuille de route produit",
      type: "pdf",
      category: "Produit",
      date: "08 mai 2024 à 16:20",
      author: "Par Amine B.",
      action: "download"
    },
    {
      id: "6",
      name: "Rapport_Financier_T1_2024.pdf",
      description: "Rapport financier - T1 2024",
      type: "pdf",
      category: "Finance",
      date: "07 mai 2024 à 14:10",
      author: "Par Doria K.",
      action: "download"
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px]">PDF</div>;
      case "excel":
        return <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold text-[10px]">X</div>;
      case "word":
        return <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">W</div>;
      default:
        return <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center"><FileIcon size={16} /></div>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Stratégie":
        return <span className="px-2.5 py-1 bg-[#f1edfa] text-[#47295C] rounded-md text-[10px] font-bold">Stratégie</span>;
      case "Finance":
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold">Finance</span>;
      case "Produit":
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold">Produit</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold">{category}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header Info */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
            <FolderIcon size={20} className="text-gray-400" />
            Documents accessibles (lecture seule)
            <Shield size={16} className="text-[#47295C]" />
          </h3>
          <p className="text-sm text-gray-500">
            Vous avez un accès accordé par la startup. Seuls les documents publiés sont visibles.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Accès accordé le</p>
              <p className="font-semibold text-gray-700">10 mai 2024</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Dernière connexion</p>
              <p className="font-semibold text-gray-700">aujourd'hui à 10:42</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-2/5">Nom du document</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-1/5">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 w-1/5">Date de mise à jour ↓</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-900 text-center w-1/5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                
                {/* Document Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{doc.name}</h4>
                      <p className="text-[11px] text-gray-500">{doc.description}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  {getCategoryBadge(doc.category)}
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">{doc.date}</p>
                  <p className="text-[10px] text-gray-500">{doc.author}</p>
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {doc.action === "download" ? (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#eaddf7] rounded-lg text-[#47295C] hover:bg-[#f8f5ff] transition-colors font-bold text-[11px]">
                        <Download size={14} />
                        Télécharger
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#eaddf7] rounded-lg text-[#47295C] hover:bg-[#f8f5ff] transition-colors font-bold text-[11px]">
                        <Eye size={14} />
                        Consulter
                      </button>
                    )}
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500 bg-gray-50/30">
        Affichage de 1 à 6 sur 6 documents
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white bg-gray-50">
            &lt;
          </button>
          <button className="w-7 h-7 rounded bg-[#47295C] text-white flex items-center justify-center font-bold shadow-sm">
            1
          </button>
          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white bg-gray-50">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

// Temporary Folder Icon 
function FolderIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
}
