"use client";

import React, { useState } from "react";
import { Upload, X, User, Target, Bell, Info, Save, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const PREDEFINED_SECTORS = [
  "HealthTech",
  "MedTech",
  "Biotech",
  "AgriTech",
  "FinTech",
  "SaaS",
  "E-commerce",
  "EdTech",
  "DeepTech",
  "Entrepreneuriat féminin"
];

export default function InvestorPreferencesForm({ initialData = {} }: { initialData?: any }) {
  const router = useRouter();
  
  const [organisation, setOrganisation] = useState(initialData.organisation || "");
  const [typeInvestisseur, setTypeInvestisseur] = useState(initialData.typeInvestisseur || "Venture Capital (VC)");
  const [siteWeb, setSiteWeb] = useState(initialData.siteWeb || "");
  const [bio, setBio] = useState(initialData.bio || "");
  
  const [sectors, setSectors] = useState<string[]>(initialData.secteursCibles || []);
  const [isSecteursOpen, setIsSecteursOpen] = useState(false);
  
  const [emailAlert, setEmailAlert] = useState(initialData.emailAlerts ?? true);
  const [watchlistAlert, setWatchlistAlert] = useState(initialData.watchlistAlerts ?? true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const toggleSecteur = (secteur: string) => {
    if (sectors.includes(secteur)) {
      setSectors(sectors.filter(s => s !== secteur));
    } else {
      setSectors([...sectors, secteur]);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/investor/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisation,
          typeInvestisseur,
          siteWeb,
          bio,
          secteursCibles: sectors,
          emailAlerts: emailAlert,
          watchlistAlerts: watchlistAlert
        })
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      
      setMessage({ type: "success", text: "Préférences sauvegardées avec succès !" });
      router.refresh();
      
      // Hide message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Une erreur est survenue." });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
      
      {/* Top Grid: Profile & Thesis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Section A: Profil Public */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-[#47295C]" size={20} />
            <h2 className="text-lg font-bold text-gray-900">A. Profil Public <span className="text-gray-400 font-normal">(Identity)</span></h2>
          </div>
          <p className="text-sm text-gray-500 mb-8">Ces informations seront visibles par les startups lorsque vous interagissez avec elles.</p>
          
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col gap-3 shrink-0">
              <label className="text-sm font-bold text-gray-900">Photo / Logo</label>
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center relative overflow-hidden group hover:border-[#47295C]/50 transition-colors cursor-pointer">
                <div className="w-20 h-20 bg-[#47295C] rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-sm">
                  A
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#47295C] border border-gray-100">
                  <Upload size={14} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center font-medium">JPG, PNG (max. 2MB)</p>
              <button type="button" className="w-full py-2 bg-white border border-[#eaddf7] text-[#47295C] rounded-lg text-xs font-bold hover:bg-[#f8f5ff] transition-colors">
                Télécharger
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Nom de l'entité / Nom complet <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Type d'investisseur <span className="text-red-500">*</span></label>
                <select 
                  value={typeInvestisseur}
                  onChange={(e) => setTypeInvestisseur(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] appearance-none"
                >
                  <option>Venture Capital (VC)</option>
                  <option>Business Angel</option>
                  <option>Corporate Venture</option>
                  <option>Family Office</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Site web <span className="text-gray-400 font-normal">(optionnel)</span></label>
                <input 
                  type="url" 
                  value={siteWeb}
                  onChange={(e) => setSiteWeb(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C]"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-900 mb-1.5">À propos <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <textarea 
              rows={3} 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] resize-none"
            ></textarea>
            <p className="text-[10px] text-gray-400 text-right mt-1">{bio.length} / 500</p>
          </div>
        </div>

        {/* Section B: Thèse d'Investissement */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-[#47295C]" size={20} />
            <h2 className="text-lg font-bold text-gray-900">B. Thèse d'Investissement <span className="text-gray-400 font-normal">(Vos critères)</span></h2>
          </div>
          <p className="text-sm text-gray-500 mb-8">Définissez vos critères pour personnaliser votre deal flow et les recommandations IA.</p>

          <div className="flex-1 flex flex-col gap-6">
            {/* Target Sectors */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Secteurs Cibles <span className="text-red-500">*</span></label>
              <div className="relative">
                <div 
                  onClick={() => setIsSecteursOpen(!isSecteursOpen)}
                  className="min-h-[50px] p-2 bg-white border border-gray-200 rounded-xl cursor-pointer flex items-center justify-between transition-colors focus-within:ring-2 focus-within:ring-[#47295C]/20 focus-within:border-[#47295C]"
                >
                  <div className="flex flex-wrap gap-2">
                    {sectors.length === 0 ? (
                      <span className="text-gray-400 text-sm ml-2">Sélectionner des secteurs...</span>
                    ) : (
                      sectors.map((secteur) => (
                        <span 
                          key={secteur} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f5ff] text-[#47295C] rounded-lg text-[11px] font-bold border border-[#eaddf7]"
                        >
                          {secteur}
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); toggleSecteur(secteur); }}
                            className="text-[#47295C]/50 hover:text-[#47295C] focus:outline-none"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform mr-2 ${isSecteursOpen ? "rotate-180" : ""}`} />
                </div>
                
                {isSecteursOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {PREDEFINED_SECTORS.map((secteur) => (
                      <div 
                        key={secteur}
                        onClick={() => toggleSecteur(secteur)}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between ${sectors.includes(secteur) ? 'bg-[#f1edfa]/50 text-[#47295C] font-medium' : 'text-gray-700'}`}
                      >
                        {secteur}
                        {sectors.includes(secteur) && <X size={14} className="text-[#47295C]" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Section C: Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="text-[#47295C]" size={20} />
          <h2 className="text-lg font-bold text-gray-900">C. Notifications & Alertes</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Restez informé des opportunités qui comptent pour vous.</p>

        <div className="flex flex-col gap-6 max-w-4xl">
          {/* Notification 1 */}
          <div className="flex items-start justify-between gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#47295C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">M'alerter par email pour une nouvelle startup correspondant à mes critères</p>
                <p className="text-xs text-gray-500">Recevez un email dès qu'une nouvelle startup correspond à vos préférences d'investissement.</p>
              </div>
            </div>
            {/* Toggle Switch */}
            <button 
              onClick={() => setEmailAlert(!emailAlert)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1 ${emailAlert ? 'bg-[#47295C]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailAlert ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notification 2 */}
          <div className="flex items-start justify-between gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#47295C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">M'alerter lors d'une mise à jour dans ma Watchlist</p>
                <p className="text-xs text-gray-500">Soyez notifié quand une startup de votre Watchlist ajoute de nouveaux documents ou atteint un jalon important.</p>
              </div>
            </div>
            {/* Toggle Switch */}
            <button 
              onClick={() => setWatchlistAlert(!watchlistAlert)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1 ${watchlistAlert ? 'bg-[#47295C]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${watchlistAlert ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar moved from page.tsx to here so it has access to form state */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20 flex justify-end gap-4 items-center">
        <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center px-4 lg:px-8">
          
          <div>
            {message.text && (
              <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {message.text}
              </span>
            )}
          </div>
          
          <div className="flex gap-4">
            <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
              <RotateCcw size={16} />
              Réinitialiser
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#47295C] text-white rounded-lg text-sm font-bold hover:bg-[#5a3875] transition-colors shadow-md disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Enregistrer les préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure ChevronDown is available
function ChevronDown(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
}
