"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false);

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

      <div className="max-w-[480px] mx-auto relative z-10 px-4">
        
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
            Bienvenue sur IN-CUBATOR
          </h1>
          <p className="text-gray-500 text-sm">
            Connectez-vous à votre espace pour continuer
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(71,41,92,0.06)] border border-gray-100 mb-6">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-[#47295C] mb-2">Connexion à votre compte</h2>
            <p className="text-xs text-gray-500 leading-relaxed px-4">
              Accédez à votre dashboard, suivez votre projet et profitez de toutes les ressources.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
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
              <div className="flex justify-end mt-2">
                <Link href="#" className="text-xs font-bold text-[#964594] hover:text-[#47295C] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-[#47295C] focus:ring-[#964594]"
              />
              <label htmlFor="remember" className="text-xs font-medium text-gray-600 cursor-pointer">
                Se souvenir de moi
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#47295C] hover:bg-[#964594] text-white rounded-xl font-bold text-sm tracking-wide transition-colors shadow-sm"
            >
              Se connecter
            </button>

            {/* Divider */}
            <div className="flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ou</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Magic Link Button */}
            <button
              type="button"
              className="w-full py-3.5 bg-white border border-[#47295C]/20 hover:border-[#47295C] hover:bg-gray-50 text-[#47295C] rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} className="text-[#964594]" />
              Se connecter avec un lien magique
            </button>

          </form>

          <div className="mt-8 text-center text-xs text-gray-500 font-medium">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-[#47295C] font-bold hover:text-[#964594] transition-colors ml-1">
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#F3EEF5] rounded-2xl p-5 flex items-start gap-4 border border-[#47295C]/5">
          <ShieldCheck className="text-[#964594] shrink-0 mt-0.5" size={24} strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-[#47295C] text-sm mb-1">Connexion sécurisée</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vos données sont protégées et confidentielles. Nous utilisons des protocoles de sécurité avancés pour garantir la protection de votre compte.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
