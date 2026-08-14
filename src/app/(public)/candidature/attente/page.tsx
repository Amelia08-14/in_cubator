import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


export default async function AttentePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const profile = await prisma.startupProfile.findUnique({
    where: { userId: session.user.id },
    include: { candidature: true }
  });

  // If accepted, redirect to dashboard
  if (profile?.candidature?.statut === "ACCEPTEE") {
    redirect("/espace");
  }

  return (
    <div className="min-h-screen bg-[#F9F7FA] font-sans flex items-center justify-center p-6" data-theme="light">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-gray-100 shadow-[0_8px_32px_rgba(71,41,92,0.08)] text-center relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#47295C]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="w-20 h-20 bg-[#F3EEF5] text-[#964594] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#964594]/10">
          <Clock size={32} strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-[#47295C] mb-4">Candidature en cours de révision</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Merci pour votre soumission ! L'équipe IN-CUBATOR examine actuellement votre dossier. Vous recevrez une notification dès qu'une décision sera prise.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 text-left mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-[#964594]" />
            <span className="text-xs font-bold text-[#47295C]">Évaluation sécurisée</span>
          </div>
          <p className="text-[11px] text-gray-500 pl-7 leading-relaxed">
            Vos informations et documents sont protégés et ne seront consultés que par notre comité d'évaluation.
          </p>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#47295C] hover:bg-[#964594] transition-colors px-6 py-3 rounded-lg w-full justify-center shadow-md"
        >
          Retour à l'accueil
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
