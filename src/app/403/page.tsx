"use client";

import React from "react";
import Link from "next/link";
import { ShieldX, ArrowLeft, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function ForbiddenPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const getDashboard = () => {
    switch (role) {
      case 'ADMIN':
      case 'GESTIONNAIRE':
        return '/admin';
      case 'PORTEUR_STARTUP':
        return '/espace';
      case 'MENTOR_EXPERT':
        return '/espace-mentor';
      case 'INVESTISSEUR':
        return '/espace-investisseur';
      default:
        return '/connexion';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <ShieldX className="text-red-500" size={40} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#47295C] mb-3">
          Accès refusé
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          <br />
          Veuillez retourner à votre espace personnel.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {role ? (
            <Link
              href={getDashboard()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#47295C] hover:bg-[#964594] text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <ArrowLeft size={16} />
              Retourner à mon espace
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#47295C] hover:bg-[#964594] text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <ArrowLeft size={16} />
              Se connecter
            </Link>
          )}

          {role && (
            <button
              onClick={() => signOut({ callbackUrl: "/connexion" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
