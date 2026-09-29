import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Candidature en cours de révision" };

export default async function AttentePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const profile = await prisma.startupProfile.findUnique({
    where: { userId: session.user.id },
    include: { candidature: true },
  });

  // Une fois acceptée, la startup entre dans son espace.
  if (profile?.candidature?.statut === "ACCEPTEE") {
    redirect("/espace");
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-paper px-5 py-32">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-10 w-[50%] bg-paper-deep"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="facet-tr w-full max-w-lg bg-white p-9 shadow-deep sm:p-12">
        <span className="hex flex h-16 w-16 items-center justify-center bg-violet-dark text-white" aria-hidden>
          <Clock size={28} strokeWidth={1.8} />
        </span>
        <h1 className="mt-7 font-serif text-3xl font-extrabold leading-tight text-violet-dark">
          Candidature en cours de révision.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-main">
          Merci pour votre soumission&nbsp;! L&apos;équipe IN-CUBATOR examine actuellement votre dossier.
          Vous recevrez une notification dès qu&apos;une décision sera prise.
        </p>

        <p className="mt-7 flex items-start gap-3 border-t border-line pt-6 text-sm leading-relaxed text-gray-main">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-violet-main" />
          Vos informations et documents sont protégés et ne sont consultés que par notre comité d&apos;évaluation.
        </p>

        <Link href="/" className="btn btn-violet mt-8 w-full">
          Retour à l&apos;accueil <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}
