"use client";

import React, { useState } from "react";
import { Bell, ChevronDown, Camera, Check, Link as LinkIcon, Calendar, Video, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";

const AVAILABLE_SECTEURS = [
  "Santé / Health", "FinTech", "AgriTech", "EdTech", "E-commerce", "SaaS", "IA / Data", "Impact"
];
const AVAILABLE_EXPERTISE = [
  "Go-to-Market", "Levée de fonds", "Stratégie produit", "Business Model", "Architecture Tech", "Growth Hacking", "Marketing", "RH / Recrutement"
];

export default function ParametresClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [format, setFormat] = useState<"Visioconférence" | "En présentiel">("Visioconférence");
  const [newRequestAlert, setNewRequestAlert] = useState(true);
  const [changeAlert, setChangeAlert] = useState(true);

  // Form State
  const [nomComplet, setNomComplet] = useState(initialData.nomComplet || "");
  const [titreFonction, setTitreFonction] = useState(initialData.titreFonction || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData.linkedinUrl || "");
  const [secteurs, setSecteurs] = useState<string[]>(initialData.secteurs || []);
  const [expertise, setExpertise] = useState<string[]>(initialData.expertise || []);

  const [secteurDropdownOpen, setSecteurDropdownOpen] = useState(false);
  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);

  const isDirty = 
    nomComplet !== (initialData.nomComplet || "") ||
    titreFonction !== (initialData.titreFonction || "") ||
    bio !== (initialData.bio || "") ||
    linkedinUrl !== (initialData.linkedinUrl || "") ||
    JSON.stringify(secteurs) !== JSON.stringify(initialData.secteurs || []) ||
    JSON.stringify(expertise) !== JSON.stringify(initialData.expertise || []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/mentors/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomComplet,
          titreFonction,
          bio,
          linkedinUrl,
          secteurs,
          expertise
        })
      });

      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const addSecteur = (secteur: string) => {
    if (!secteurs.includes(secteur)) setSecteurs([...secteurs, secteur]);
    setSecteurDropdownOpen(false);
  };

  const removeSecteur = (secteur: string) => {
    setSecteurs(secteurs.filter(s => s !== secteur));
  };

  const addExpertise = (exp: string) => {
    if (!expertise.includes(exp)) setExpertise([...expertise, exp]);
    setExpertiseDropdownOpen(false);
  };

  const removeExpertise = (exp: string) => {
    setExpertise(expertise.filter(e => e !== exp));
  };

  const initials = nomComplet ? nomComplet.substring(0, 2).toUpperCase() : initialData.email.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#47295C] mb-1">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre profil mentor et vos préférences.</p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="relative p-2 text-gray-500 hover:text-[#47295C] transition-colors rounded-full hover:bg-purple-50">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#47295C] rounded-full ring-2 ring-white"></span>
          </button>
          
          <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-sm border border-[#eaddf7]">
              {initials}
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8">
        <form onSubmit={handleSave} className="max-w-[1600px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              {/* 1. Profil Public */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#f8f5ff] text-[#47295C] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">1. Profil Public</h2>
                    <p className="text-xs text-gray-500 font-medium">Ces informations seront visibles par les startups.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Photo Upload */}
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Photo de profil</label>
                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-4 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#47295C] mb-2 transition-colors">
                        <Camera size={18} />
                      </div>
                      <p className="text-[10px] font-semibold text-gray-500">JPG, PNG ou WEBP</p>
                      <p className="text-[10px] text-gray-400">max. 5 Mo</p>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Nom complet</label>
                      <input 
                        type="text" 
                        value={nomComplet}
                        onChange={(e) => setNomComplet(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Titre / Fonction</label>
                      <input 
                        type="text" 
                        value={titreFonction}
                        onChange={(e) => setTitreFonction(e.target.value)}
                        placeholder="Ex: Mentor Expert en Stratégie"
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Biographie</label>
                    <textarea 
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all resize-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Lien LinkedIn</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={16} className="text-[#0077B5]" />
                      </div>
                      <input 
                        type="url" 
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://www.linkedin.com/in/votre-profil"
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Préférences de Mentorat */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#f8f5ff] text-[#47295C] flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">3. Préférences de Mentorat</h2>
                    <p className="text-xs text-gray-500 font-medium">Définissez votre capacité et vos préférences d'accompagnement.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Capacité maximale par mois</label>
                    <p className="text-[10px] text-gray-500 mb-3">Nombre d'heures que vous pouvez consacrer.</p>
                    <div className="relative">
                      <select className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all">
                        <option>15 heures / mois</option>
                        <option>20 heures / mois</option>
                        <option>30 heures / mois</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Nombre maximum de startups</label>
                    <p className="text-[10px] text-gray-500 mb-3">Nombre de startups que vous souhaitez accompagner.</p>
                    <div className="relative">
                      <select className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all">
                        <option>5 startups / mois</option>
                        <option>10 startups / mois</option>
                        <option>Illimité</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Format par défaut</label>
                  <p className="text-[10px] text-gray-500 mb-3">Votre format de rendez-vous préféré.</p>
                  
                  <div className="flex gap-4">
                    <div 
                      onClick={() => setFormat("Visioconférence")}
                      className={`flex-1 flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        format === "Visioconférence" 
                          ? "border-[#47295C] bg-[#f8f5ff] text-[#47295C]" 
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Video size={18} />
                        <span className="text-sm font-semibold">Visioconférence</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        format === "Visioconférence" ? "border-[#47295C]" : "border-gray-300"
                      }`}>
                        {format === "Visioconférence" && <div className="w-2 h-2 rounded-full bg-[#47295C]" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setFormat("En présentiel")}
                      className={`flex-1 flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        format === "En présentiel" 
                          ? "border-[#47295C] bg-[#f8f5ff] text-[#47295C]" 
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={18} />
                        <span className="text-sm font-semibold">En présentiel</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        format === "En présentiel" ? "border-[#47295C]" : "border-gray-300"
                      }`}>
                        {format === "En présentiel" && <div className="w-2 h-2 rounded-full bg-[#47295C]" />}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* 2. Expertise & Secteurs */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#f8f5ff] text-[#47295C] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">2. Expertise & Secteurs</h2>
                    <p className="text-xs text-gray-500 font-medium">Aidez les startups à vous trouver grâce à vos domaines d'expertise.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Secteurs d'activité */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Secteurs d'activité</label>
                    <div className="min-h-[48px] p-2 border border-gray-200 rounded-lg flex flex-wrap gap-2 items-center relative">
                      {secteurs.map(secteur => (
                        <span key={secteur} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f8f5ff] text-[#47295C] text-xs font-semibold rounded-md">
                          {secteur}
                          <button type="button" onClick={() => removeSecteur(secteur)} className="hover:text-purple-900">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      
                      <div className="relative flex-1 min-w-[120px]">
                        <button 
                          type="button"
                          onClick={() => setSecteurDropdownOpen(!secteurDropdownOpen)}
                          className="w-full text-left text-xs text-gray-500 px-2 py-1 outline-none flex justify-between items-center"
                        >
                          Ajouter un secteur...
                          <ChevronDown size={14} />
                        </button>
                        
                        {secteurDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden">
                            {AVAILABLE_SECTEURS.filter(s => !secteurs.includes(s)).map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => addSecteur(s)}
                                className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Compétences (sujets que vous accompagnez)</label>
                    <div className="min-h-[48px] p-2 border border-gray-200 rounded-lg flex flex-wrap gap-2 items-center relative">
                      {expertise.map(exp => (
                        <span key={exp} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f8f5ff] text-[#47295C] text-xs font-semibold rounded-md">
                          {exp}
                          <button type="button" onClick={() => removeExpertise(exp)} className="hover:text-purple-900">
                            <X size={12} />
                          </button>
                        </span>
                      ))}

                      <div className="relative flex-1 min-w-[120px]">
                        <button 
                          type="button"
                          onClick={() => setExpertiseDropdownOpen(!expertiseDropdownOpen)}
                          className="w-full text-left text-xs text-gray-500 px-2 py-1 outline-none flex justify-between items-center"
                        >
                          Ajouter une compétence...
                          <ChevronDown size={14} />
                        </button>
                        
                        {expertiseDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden">
                            {AVAILABLE_EXPERTISE.filter(e => !expertise.includes(e)).map(e => (
                              <button
                                key={e}
                                type="button"
                                onClick={() => addExpertise(e)}
                                className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Notifications */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#f8f5ff] text-[#47295C] flex items-center justify-center shrink-0">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">4. Notifications</h2>
                    <p className="text-xs text-gray-500 font-medium">Choisissez comment vous souhaitez être notifié.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Alert 1 */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">M'alerter par email pour une nouvelle demande de RDV</h4>
                        <p className="text-xs text-gray-500">Recevez un email lorsqu'une startup demande un rendez-vous.</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setNewRequestAlert(!newRequestAlert)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${newRequestAlert ? 'bg-[#47295C]' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newRequestAlert ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Alert 2 */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-gray-400">
                        <Video size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">M'alerter par email pour un changement de rendez-vous</h4>
                        <p className="text-xs text-gray-500">Recevez un email si un rendez-vous est modifié ou annulé.</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setChangeAlert(!changeAlert)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${changeAlert ? 'bg-[#47295C]' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${changeAlert ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </section>

              {/* 5. Sécurité */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#f8f5ff] text-[#47295C] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">5. Sécurité</h2>
                    <p className="text-xs text-gray-500 font-medium">Gérez vos informations de connexion.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-gray-900">Changer votre mot de passe</span>
                  <button type="button" className="px-4 py-2 border border-[#eaddf7] text-[#47295C] text-xs font-bold rounded-lg hover:bg-purple-50 transition-colors">
                    Modifier
                  </button>
                </div>
              </section>

            </div>
          </div>

          {/* Action Footer */}
          <div className="fixed bottom-0 right-0 lg:w-[calc(100%-16rem)] w-full bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex items-center justify-end shadow-lg z-20">
            <button 
              type="submit" 
              disabled={isSaving || (!isDirty && !isSaved)}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-md ${
                isSaved
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : !isDirty
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : isSaving
                  ? 'bg-[#47295C] text-white opacity-70 cursor-not-allowed'
                  : 'bg-[#47295C] text-white hover:bg-[#5a3875]'
              }`}
            >
              {isSaved ? <Check size={18} /> : null}
              {isSaving ? "Enregistrement..." : isSaved ? "Modifications enregistrées" : "Enregistrer les modifications"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
