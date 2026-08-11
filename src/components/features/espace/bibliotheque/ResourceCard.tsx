"use client";

import React from "react";
import { Download, MoreVertical } from "lucide-react";

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryClass: string;
  fileType: "pdf" | "docx" | "xlsx" | "pptx";
  size: string;
  date: string;
}

export default function ResourceCard({ resource }: { resource: ResourceItem }) {
  const getFileIcon = (ext: string) => {
    switch (ext) {
      case "pdf": return { bg: "bg-red-500", text: "PDF" };
      case "xlsx": return { bg: "bg-green-500", text: "X" };
      case "docx": return { bg: "bg-blue-600", text: "W" };
      case "pptx": return { bg: "bg-orange-500", text: "P" };
      default: return { bg: "bg-gray-500", text: "FILE" };
    }
  };

  const icon = getFileIcon(resource.fileType);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col hover:shadow-md hover:border-[#964594]/30 transition-all group">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm ${icon.bg} shrink-0`}>
            {icon.text}
          </div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide whitespace-nowrap ${resource.categoryClass}`}>
            {resource.category}
          </span>
        </div>
        <button className="text-gray-400 hover:text-[#47295C] transition-colors p-1">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col mb-4">
        <h3 className="font-bold text-sm text-[#47295C] mb-2 leading-tight group-hover:text-[#964594] transition-colors">
          {resource.title}
        </h3>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">
          {resource.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-5">
        <span>{resource.fileType.toUpperCase()}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
        <span>{resource.size}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
        <span>{resource.date}</span>
      </div>

      {/* CTA */}
      <button 
        onClick={() => alert(`Téléchargement de ${resource.title} simulé !`)}
        className="w-full py-2.5 rounded-lg border border-[#964594]/20 text-[#964594] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#964594]/5 transition-colors"
      >
        <Download size={14} />
        Télécharger
      </button>

    </div>
  );
}
