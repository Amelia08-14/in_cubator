"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AdminUsersSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminUsersSlideOver({ isOpen, onClose }: AdminUsersSlideOverProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [passwordOption, setPasswordOption] = useState("generate");

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
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Créer un utilisateur</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Nom complet */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Ex. Amine Baghli"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Adresse Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors"
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-[#47295C] focus:ring-1 focus:ring-[#47295C] transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled>Sélectionner un rôle</option>
              <option value="admin">Administrateur</option>
              <option value="startup">Startup</option>
              <option value="mentor">Mentor / Expert</option>
              <option value="investisseur">Investisseur</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-4">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            
            <div className="space-y-4">
              {/* Option 1: Generate */}
              <div 
                className="flex flex-col gap-1 cursor-pointer" 
                onClick={() => setPasswordOption("generate")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${passwordOption === "generate" ? "border-[#3719CA]" : "border-gray-300"}`}>
                    {passwordOption === "generate" && <div className="w-2 h-2 rounded-full bg-[#3719CA]" />}
                  </div>
                  <span className="text-sm font-bold text-gray-900">Générer un mot de passe temporaire</span>
                </div>
                <p className="text-[11px] text-gray-500 pl-7">
                  Un mot de passe temporaire sera généré et envoyé par email à l'utilisateur.
                </p>
              </div>

              {/* Option 2: Manual */}
              <div 
                className="flex flex-col gap-1 cursor-pointer" 
                onClick={() => setPasswordOption("manual")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${passwordOption === "manual" ? "border-[#3719CA]" : "border-gray-300"}`}>
                    {passwordOption === "manual" && <div className="w-2 h-2 rounded-full bg-[#3719CA]" />}
                  </div>
                  <span className="text-sm font-bold text-gray-700">Définir un mot de passe temporaire</span>
                </div>
                <p className="text-[11px] text-gray-500 pl-7">
                  Vous pourrez définir un mot de passe temporaire manuellement.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            Annuler
          </button>
          <button className="px-6 py-2.5 bg-[#3719CA] text-white rounded-lg text-sm font-bold hover:bg-[#2b10ac] transition-colors shadow-md">
            Créer l'utilisateur
          </button>
        </div>

      </div>
    </>
  );
}
