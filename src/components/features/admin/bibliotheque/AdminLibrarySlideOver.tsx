"use client";

import React, { useState } from "react";
import { X, UploadCloud } from "lucide-react";

interface AdminLibrarySlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLibrarySlideOver({ isOpen, onClose }: AdminLibrarySlideOverProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Ajouter une ressource</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Titre */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Titre du document <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Ex. Modèle de Business Plan V2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors appearance-none cursor-pointer">
              <option value="">Sélectionner une catégorie</option>
              <option value="modeles">Modèles / Templates</option>
              <option value="finance">Finance</option>
              <option value="juridique">Juridique</option>
              <option value="strategie">Stratégie</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              rows={4}
              placeholder="Décrivez brièvement le contenu et l'objectif de ce document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-gray-400">{description.length} / 300</span>
            </div>
          </div>

          {/* Fichier */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Fichier <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-[#eaddf7] rounded-xl p-8 bg-[#fbf9ff] flex flex-col items-center justify-center text-center">
              <UploadCloud size={32} className="text-[#47295C] mb-3" />
              <p className="text-sm font-bold text-gray-700 mb-2">Glissez-déposez votre fichier ici</p>
              <p className="text-xs text-gray-500 mb-4">ou</p>
              <button className="px-6 py-2 bg-[#f1edfa] text-[#47295C] border border-[#eaddf7] rounded-lg text-xs font-bold hover:bg-[#eaddf7] transition-colors">
                Parcourir les fichiers
              </button>
              <p className="text-[10px] text-gray-400 mt-4">
                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max. 20 Mo)
              </p>
            </div>
          </div>

          {/* Visibilité (Audience) */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">
              Visibilité (Audience) <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-gray-500 mb-3">
              Sélectionnez qui peut voir cette ressource.
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#47295C] focus:ring-[#47295C]" />
                <span className="text-sm text-gray-900">Toutes les startups</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#47295C] focus:ring-[#47295C]" />
                <span className="text-sm text-gray-600">Cohorte Santé 2026</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#47295C] focus:ring-[#47295C]" />
                <span className="text-sm text-gray-600">Cohorte Finance 2026</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#47295C] focus:ring-[#47295C]" />
                <span className="text-sm text-gray-600">Entrepreneuriat féminin</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#47295C] focus:ring-[#47295C]" />
                <span className="text-sm text-gray-600">Cohorte AgriTech 2026</span>
              </label>
            </div>
            
            <button className="text-[11px] font-bold text-[#47295C] mt-3 hover:underline">
              + Voir plus de cohortes
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            Annuler
          </button>
          <button className="px-6 py-2.5 bg-[#3719CA] text-white rounded-lg text-sm font-bold hover:bg-[#2b10ac] transition-colors shadow-md">
            Enregistrer la ressource
          </button>
        </div>

      </div>
    </>
  );
}
