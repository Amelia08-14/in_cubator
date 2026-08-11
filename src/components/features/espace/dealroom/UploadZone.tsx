"use client";

import React from "react";
import { CloudUpload } from "lucide-react";

export default function UploadZone() {
  return (
    <div className="mb-8">
      <div className="border-2 border-dashed border-[#964594]/50 bg-[#F9F7FA] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#964594]/5 transition-colors relative group">
        
        {/* Mock input to simulate clickable zone */}
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          accept=".pdf,.xlsx,.xls,.docx" 
          multiple
        />

        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <CloudUpload size={32} className="text-[#47295C]" strokeWidth={1.5} />
        </div>

        <h3 className="font-bold text-[#47295C] text-lg mb-1">
          Déposez vos fichiers ici ou <span className="text-[#964594]">cliquez pour parcourir</span>
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Formats acceptés : PDF, Excel (.xlsx, .xls), Word (.docx)
        </p>

        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              PDF
            </div>
            <span className="text-[10px] font-bold text-gray-500">PDF</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              XLSX
            </div>
            <span className="text-[10px] font-bold text-gray-500">XLSX</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              DOCX
            </div>
            <span className="text-[10px] font-bold text-gray-500">DOCX</span>
          </div>
        </div>

      </div>
    </div>
  );
}
