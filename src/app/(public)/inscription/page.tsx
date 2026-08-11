"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Building2 } from "lucide-react";

export default function InscriptionPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"particulier" | "entreprise">("particulier");

  return (
    <div className="min-h-screen bg-[#F9F7FA] text-[#47295C] relative overflow-x-hidden pt-32 pb-24 font-sans" data-theme="light">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#47295C 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
      }}></div>
      
      {/* Large faint background swirls */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none opacity-20 z-0 hidden lg:block overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] rounded-full border-[1px] border-[#964594]/20"></div>
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#964594]/20"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none opacity-20 z-0 hidden lg:block overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#47295C]/20"></div>
      </div>

      <div className="max-w-[540px] mx-auto relative z-10 px-4">
        
        {/* Header Text */}
        <div className="flex flex-col items-center text-center mb-8">
          <Image 
            src="/logo.png" 
            alt="IN-CUBATOR" 
            width={160} 
            height={50} 
            className="object-contain mb-6" 
          />
          <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-[#47295C] mb-3">
            Rejoignez IN-CUBATOR
          </h1>
          <p className="text-gray-500 text-sm">
            Créez votre compte pour démarrer votre aventure
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(71,41,92,0.06)] border border-gray-100 mb-6">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-[#47295C] mb-2">Création de compte</h2>
            <p className="text-xs text-gray-500 leading-relaxed px-4">
              Sélectionnez votre type de profil pour commencer.
            </p>
          </div>

          {/* Account Type Selector */}
          <div className="flex p-1 bg-gray-50 rounded-xl mb-8 border border-gray-100">
            <button
              onClick={() => setAccountType("particulier")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                accountType === "particulier" 
                  ? "bg-white text-[#47295C] shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <User size={16} />
              Particulier
            </button>
            <button
              onClick={() => setAccountType("entreprise")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                accountType === "entreprise" 
                  ? "bg-white text-[#47295C] shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Building2 size={16} />
              Entreprise
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Dynamic Fields based on Account Type */}
            {accountType === "entreprise" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#47295C]">Nom de l'entreprise</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Building2 size={16} strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#964594]/50 focus:border-[#964594] transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Votre entreprise"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#47295C]">Nom complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={16} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#964594]/50 focus:border-[#964594] transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#47295C]">Adresse e-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} strokeWidth={2} />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#964594]/50 focus:border-[#964594] transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-[#47295C]">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#964594]/50 focus:border-[#964594] transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#47295C] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#47295C] focus:ring-[#964594]"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                J'accepte les <Link href="#" className="font-bold text-[#964594] hover:text-[#47295C]">Conditions d'utilisation</Link> et la <Link href="#" className="font-bold text-[#964594] hover:text-[#47295C]">Politique de confidentialité</Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-[#47295C] hover:bg-[#964594] text-white rounded-xl font-bold text-sm tracking-wide transition-colors shadow-sm"
            >
              Créer mon compte
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-xs text-gray-500 font-medium">
            Vous avez déjà un compte ?{" "}
            <Link href="/connexion" className="text-[#47295C] font-bold hover:text-[#964594] transition-colors ml-1">
              Se connecter
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
