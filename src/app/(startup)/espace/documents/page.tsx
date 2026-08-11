"use client";

import React from "react";
import Header from "@/components/features/espace/Header";
import { FileText, Folder, Plus, Upload, ChevronRight, Edit3, FolderInput, Users, Trash2, ChevronLeft, ChevronDown } from "lucide-react";
import Image from "next/image";

// Mock Data for Folders
const mockFolders = [
  { id: 1, name: "Notes de Réunion", desc: "Notes et synthèses des réunions internes et avec les mentors.", count: 12 },
  { id: 2, name: "Drafts Pitch Deck", desc: "Versions en cours de nos présentations avant finalisation.", count: 7 },
  { id: 3, name: "Recherche Marché", desc: "Analyses concurrentielles, études, sondages et rapports sectoriels.", count: 15 },
  { id: 4, name: "Rapports Hebdomadaires", desc: "Rapports de progression et mises à jour hebdomadaires.", count: 9 },
];

// Mock Data for Recent Files
const mockFiles = [
  { 
    id: 1, 
    name: "Nexora_PitchDraft_V1.pdf", 
    size: "2.4 MB",
    type: "Document PDF",
    ext: "pdf",
    modifiedDate: "12/05/2024",
    modifiedTime: "14:32",
    authorName: "Amine S.",
    authorInitials: "AS",
    authorColor: "bg-[#47295C]"
  },
  { 
    id: 2, 
    name: "CompteRendu_Reunion_Mentor_April.docx", 
    size: "156 KB",
    type: "Document Word",
    ext: "docx",
    modifiedDate: "12/05/2024",
    modifiedTime: "11:15",
    authorName: "Amal B.",
    authorInitials: "AB",
    authorColor: "bg-[#D44835]"
  },
  { 
    id: 3, 
    name: "Analyse_Concurrence_MedTech.xlsx", 
    size: "342 KB",
    type: "Feuille de calcul Excel",
    ext: "xlsx",
    modifiedDate: "11/05/2024",
    modifiedTime: "18:07",
    authorName: "Doria K.",
    authorInitials: "DK",
    authorColor: "bg-[#73B866]"
  },
  { 
    id: 4, 
    name: "Etude_Marche_Sante_NA.pdf", 
    size: "3.1 MB",
    type: "Document PDF",
    ext: "pdf",
    modifiedDate: "11/05/2024",
    modifiedTime: "09:45",
    authorName: "Amine S.",
    authorInitials: "AS",
    authorColor: "bg-[#47295C]"
  },
  { 
    id: 5, 
    name: "Plan_Action_Semaine_19.docx", 
    size: "98 KB",
    type: "Document Word",
    ext: "docx",
    modifiedDate: "10/05/2024",
    modifiedTime: "17:20",
    authorName: "Amal B.",
    authorInitials: "AB",
    authorColor: "bg-[#D44835]"
  },
  { 
    id: 6, 
    name: "Prototype_Description_V2.pdf", 
    size: "1.8 MB",
    type: "Document PDF",
    ext: "pdf",
    modifiedDate: "10/05/2024",
    modifiedTime: "12:05",
    authorName: "Doria K.",
    authorInitials: "DK",
    authorColor: "bg-[#73B866]"
  },
  { 
    id: 7, 
    name: "Survey_Results_RawData.xlsx", 
    size: "512 KB",
    type: "Feuille de calcul Excel",
    ext: "xlsx",
    modifiedDate: "09/05/2024",
    modifiedTime: "21:33",
    authorName: "Amine S.",
    authorInitials: "AS",
    authorColor: "bg-[#47295C]"
  },
];

export default function DocumentsPage() {
  
  const getFileIcon = (ext: string) => {
    switch (ext) {
      case "pdf": return <div className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-bold bg-red-500 shrink-0">PDF</div>;
      case "xlsx": return <div className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-bold bg-green-500 shrink-0">X</div>;
      case "docx": return <div className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-bold bg-blue-600 shrink-0">W</div>;
      default: return <div className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-bold bg-gray-500 shrink-0">FILE</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-[#f8f9fa] relative">
      <Header />
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm shrink-0">
                <FileText size={24} className="text-[#47295C]" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#47295C] mb-1">Espace Documents</h1>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Gérez vos documents de travail, notes de réunion, drafts internes et recherche.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#47295C] hover:bg-[#964594] text-white text-sm font-bold transition-colors shadow-sm">
                <Plus size={16} />
                Nouveau Dossier
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#47295C] hover:bg-[#964594] text-white text-sm font-bold transition-colors shadow-sm">
                <Upload size={16} />
                Importer un Fichier
              </button>
            </div>
            
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column: Folders */}
            <div className="xl:col-span-4 flex flex-col">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <Folder className="text-[#47295C]" size={20} />
                  <h2 className="text-lg font-bold text-[#47295C]">Structure de Dossiers</h2>
                </div>

                <div className="space-y-4">
                  {mockFolders.map(folder => (
                    <div 
                      key={folder.id} 
                      className="border border-gray-100 rounded-xl p-4 flex gap-4 hover:border-[#964594]/30 hover:shadow-sm cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Folder className="text-indigo-400 fill-indigo-100" size={24} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-sm text-[#47295C] truncate">{folder.name}</h3>
                          <div className="flex items-center gap-1 text-gray-400">
                            <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded-full">{folder.count}</span>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed pr-4">{folder.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 text-sm font-bold text-[#47295C] hover:text-[#964594] flex items-center gap-1 transition-colors">
                  Voir tous les dossiers <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column: Recent Files */}
            <div className="xl:col-span-8 flex flex-col">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="text-[#47295C]" size={20} />
                    <h2 className="text-lg font-bold text-[#47295C]">Fichiers Récents</h2>
                  </div>
                  <button className="text-sm font-bold text-[#47295C] hover:text-[#964594] flex items-center gap-1 transition-colors">
                    Voir tous les fichiers <ChevronRight size={14} />
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nom du fichier</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dernière modification</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ajouté par / Modifié par</th>
                        <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockFiles.map(file => (
                        <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex gap-3">
                              {getFileIcon(file.ext)}
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-[#47295C] truncate">{file.name}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{file.size}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-600">
                            {file.type}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-600">
                            <div>{file.modifiedDate}</div>
                            <div className="text-gray-400 mt-0.5">{file.modifiedTime}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {/* Simple Avatar Mock */}
                              <div className={`w-6 h-6 rounded-full text-[9px] font-bold text-white flex items-center justify-center shrink-0 ${file.authorColor}`}>
                                {file.authorInitials}
                              </div>
                              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{file.authorName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1 text-gray-400">
                              <button className="p-1.5 hover:bg-gray-100 rounded hover:text-[#47295C] transition-colors" title="Modifier">
                                <Edit3 size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded hover:text-[#47295C] transition-colors" title="Déplacer">
                                <FolderInput size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded hover:text-[#47295C] transition-colors" title="Gérer l'accès">
                                <Users size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-red-50 rounded hover:text-red-500 transition-colors" title="Supprimer">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    Affichage 1 à 7 sur 24 fichiers
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded bg-[#47295C] text-white text-sm font-bold flex items-center justify-center shadow-sm">
                      1
                    </button>
                    <button className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-50">
                      2
                    </button>
                    <button className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-50">
                      3
                    </button>
                    <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50">
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Ligne par page</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-700 bg-white">
                      10
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
