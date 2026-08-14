"use client";

import React from "react";
import { Edit2, Trash2, Users, UsersRound, ChevronLeft, ChevronRight } from "lucide-react";

interface ResourceData {
  id: number;
  name: string;
  size: string;
  fileType: string;
  fileColor: string;
  category: string;
  categoryColor: string;
  date: string;
  uploader: string;
  audience: string;
  audienceIcon: React.ReactNode;
  audienceColor: string;
}

export default function AdminLibraryTable({ resources = [] }: { resources?: ResourceData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          Toutes les ressources
          <span className="px-2 py-0.5 bg-[#f1edfa] text-[#47295C] text-[10px] rounded-full font-bold">86</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[35%]">Nom de la ressource</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%]">Catégorie</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%]">Date d'ajout ↓</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[20%]">Audience (Visibilité)</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0 ${resource.fileColor}`}>
                      {resource.fileType}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{resource.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{resource.size}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${resource.categoryColor}`}>
                    {resource.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs text-gray-900">{resource.date}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{resource.uploader}</p>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${resource.audienceColor}`}>
                    {resource.audienceIcon}
                    {resource.audience}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 text-red-500 hover:bg-red-50 border border-red-200 rounded-md transition-colors">
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
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[11px] text-gray-500">Affichage de 1 à 8 sur 86 ressources</p>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#47295C] text-white font-bold text-xs shadow-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-xs">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-xs">
            3
          </button>
          <span className="text-gray-400 text-xs px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-xs">
            11
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <ChevronRight size={14} />
          </button>
          <select className="ml-2 pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none cursor-pointer appearance-none">
            <option>8 / page</option>
            <option>16 / page</option>
            <option>24 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
