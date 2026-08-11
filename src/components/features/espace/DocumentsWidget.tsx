"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Document {
  id: string;
  name: string;
  date: string;
  type: "pdf" | "excel" | "word";
  visibleToInvestors: boolean;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Pitch Deck 2026.pdf",
    date: "22 mai 2026",
    type: "pdf",
    visibleToInvestors: true
  },
  {
    id: "2",
    name: "Business Plan.xlsx",
    date: "20 mai 2026",
    type: "excel",
    visibleToInvestors: true
  },
  {
    id: "3",
    name: "Étude de marché.docx",
    date: "18 mai 2026",
    type: "word",
    visibleToInvestors: false
  },
  {
    id: "4",
    name: "Data Room Overview.pdf",
    date: "15 mai 2026",
    type: "pdf",
    visibleToInvestors: true
  }
];

export default function DocumentsWidget() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  const toggleVisibility = (id: string) => {
    setDocuments(documents.map(d => 
      d.id === id ? { ...d, visibleToInvestors: !d.visibleToInvestors } : d
    ));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "pdf": return "bg-red-500";
      case "excel": return "bg-green-500";
      case "word": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} className="text-gray-500" />
        <h2 className="text-lg font-bold text-[#47295C]">D. Documents</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 mb-3 px-2">
          <div className="col-span-6 text-xs font-bold text-gray-500">Document</div>
          <div className="col-span-3 text-xs font-bold text-gray-500">Dernière modif.</div>
          <div className="col-span-3 text-xs font-bold text-gray-500 text-center leading-tight">Visible pour<br/>investisseurs</div>
        </div>

        <div className="space-y-1">
          {documents.map(doc => (
            <div key={doc.id} className="grid grid-cols-12 gap-4 items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold ${getIconColor(doc.type)} shrink-0`}>
                  {doc.type === "pdf" ? "PDF" : doc.type === "excel" ? "XLS" : "DOC"}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate group-hover:text-[#964594] transition-colors cursor-pointer">
                  {doc.name}
                </span>
              </div>
              
              <div className="col-span-3">
                <span className="text-xs text-gray-500">{doc.date}</span>
              </div>

              <div className="col-span-3 flex justify-center">
                <Switch 
                  checked={doc.visibleToInvestors} 
                  onCheckedChange={() => toggleVisibility(doc.id)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="text-xs font-bold text-[#964594] hover:text-[#47295C] transition-colors flex items-center gap-1 group">
          Voir tous les documents
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
