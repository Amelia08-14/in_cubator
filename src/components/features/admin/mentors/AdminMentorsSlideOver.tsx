"use client";

import React, { useState } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { realmFetch } from "@/lib/realm-fetch";
interface AdminMentorsSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMentorsSlideOver({ isOpen, onClose }: AdminMentorsSlideOverProps) {
  const router = useRouter();
  
  // Basic Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  // Password
  const [passwordOption, setPasswordOption] = useState("manual");
  const [password, setPassword] = useState("");
  
  // Mentor Profile Info
  const [expertise, setExpertise] = useState("");
  const [secteurs, setSecteurs] = useState<string[]>([]);
  const [isSecteursOpen, setIsSecteursOpen] = useState(false);
  const [langues, setLangues] = useState("");

  const PREDEFINED_SECTORS = [
    "AgriTech", "FinTech", "HealthTech", "EdTech", "E-commerce",
    "GreenTech", "SaaS", "DeepTech", "Cybersecurity", "Logistics",
    "FoodTech", "PropTech", "CleanTech", "BioTech", "IA / Machine Learning", "Autre"
  ];

  const toggleSecteur = (secteur: string) => {
    if (secteurs.includes(secteur)) {
      setSecteurs(secteurs.filter(s => s !== secteur));
    } else {
      setSecteurs([...secteurs, secteur]);
    }
  };
  const [bio, setBio] = useState("");
  const [tarif, setTarif] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Split comma separated strings into arrays for JSON fields
      const expertiseArray = expertise.split(",").map(s => s.trim()).filter(Boolean);
      const secteursArray = secteurs;
      const languesArray = langues.split(",").map(s => s.trim()).filter(Boolean);

      const res = await realmFetch("/api/admin/mentors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password: passwordOption === "manual" ? password : undefined,
          expertise: expertiseArray,
          secteurs: secteursArray,
          langues: languesArray,
          bio,
          tarifIndicatif: tarif
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Erreur lors de la création");
      }

      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setExpertise("");
      setSecteurs([]);
      setLangues("");
      setBio("");
      setTarif("");
      
      onClose();
      router.refresh();
      
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Ajouter un Mentor</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form id="mentor-form" onSubmit={handleSubmit} className="space-y-6">
            
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#47295C] border-b border-gray-100 pb-2">Informations de base</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Nom complet *</label>
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex. Dr. Karim Merzoug" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Email *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="expert@exemple.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors" />
              </div>
            </div>

            {/* Sécurité */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#47295C] border-b border-gray-100 pb-2">Sécurité</h3>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={passwordOption === "generate"} onChange={() => setPasswordOption("generate")} className="text-[#47295C] focus:ring-[#47295C]" />
                  <span className="text-sm">Générer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={passwordOption === "manual"} onChange={() => setPasswordOption("manual")} className="text-[#47295C] focus:ring-[#47295C]" />
                  <span className="text-sm">Manuel</span>
                </label>
              </div>

              {passwordOption === "manual" && (
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">Mot de passe *</label>
                  <input required={passwordOption === "manual"} type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Saisir le mot de passe" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors" />
                </div>
              )}
            </div>

            {/* Profil Expert */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#47295C] border-b border-gray-100 pb-2">Profil Expert</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Expertise(s) * <span className="font-normal text-gray-400">(séparées par des virgules)</span></label>
                <input required type="text" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="Ex. Intelligence Artificielle, Machine Learning" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Secteur(s) *</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsSecteursOpen(!isSecteursOpen)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer flex items-center justify-between transition-colors focus-within:border-[#47295C] min-h-[46px]"
                  >
                    <div className="flex flex-wrap gap-2">
                      {secteurs.length === 0 ? (
                        <span className="text-gray-400">Sélectionner des secteurs...</span>
                      ) : (
                        secteurs.map((secteur) => (
                          <span 
                            key={secteur} 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f1edfa] text-[#47295C] text-xs font-medium"
                          >
                            {secteur}
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); toggleSecteur(secteur); }}
                              className="hover:bg-[#e0d6f5] rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isSecteursOpen ? "rotate-180" : ""}`} />
                  </div>
                  
                  {isSecteursOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {PREDEFINED_SECTORS.map((secteur) => (
                        <div 
                          key={secteur}
                          onClick={() => toggleSecteur(secteur)}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between ${secteurs.includes(secteur) ? 'bg-[#f1edfa]/50 text-[#47295C] font-medium' : 'text-gray-700'}`}
                        >
                          {secteur}
                          {secteurs.includes(secteur) && <X size={14} className="text-[#47295C]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Langue(s) * <span className="font-normal text-gray-400">(séparées par des virgules)</span></label>
                <input required type="text" value={langues} onChange={(e) => setLangues(e.target.value)} placeholder="Ex. Français, Anglais, Arabe" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Bio courte *</label>
                <textarea required value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Présentation du mentor..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Tarif indicatif / Heure <span className="font-normal text-gray-400">(Optionnel)</span></label>
                <input type="text" value={tarif} onChange={(e) => setTarif(e.target.value)} placeholder="Ex. 5000 DZD" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#47295C] transition-colors" />
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm">
            Annuler
          </button>
          <button type="submit" form="mentor-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#47295C] text-white rounded-lg text-sm font-bold hover:bg-[#5a3875] transition-colors shadow-md disabled:opacity-70">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Créer le Mentor
          </button>
        </div>

      </div>
    </>
  );
}
