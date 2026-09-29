"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, CheckCircle } from "lucide-react";

interface Props {
  startupId: string;
  nom: string;
  pitchResume: string;
  logoUrl: string | null;
  secteurs: string[];
  isInvestor: boolean;
  hasRequestedAccess: boolean;
}

export default function StartupProfileClient({ 
  startupId, nom, pitchResume, logoUrl, secteurs, isInvestor, hasRequestedAccess 
}: Props) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">(
    hasRequestedAccess ? "SUCCESS" : "IDLE"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestAccess = async () => {
    if (!isInvestor) {
      alert("Seuls les investisseurs connectés peuvent demander l'accès à la Deal Room.");
      return;
    }

    setIsRequesting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/deal-room/acces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId })
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.error?.code === 'CONFLICT') {
          setRequestStatus("SUCCESS");
        } else {
          setErrorMsg(json.error?.message || "Erreur lors de la demande.");
        }
      } else {
        setRequestStatus("SUCCESS");
      }
    } catch {
      setErrorMsg("Une erreur est survenue.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-paper pb-16 pt-36 text-violet-dark lg:pb-24 lg:pt-44">
        <div
          aria-hidden
          className="absolute right-0 top-0 -z-10 h-full w-[40%] bg-paper-deep"
          style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
          <Link href="/startups" className="inline-flex items-center gap-2 text-sm font-bold text-gray-main transition-colors hover:text-violet-dark">
            <ArrowLeft size={16} /> Toutes les startups
          </Link>
          <div className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
            <div className="hex relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden bg-violet-dark">
              {logoUrl ? (
                // Les logos sont téléversés par les startups : origine et dimensions inconnues.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={`Logo de ${nom}`} className="h-full w-full object-cover" />
              ) : (
                <span className="font-serif text-5xl font-bold text-white">{nom.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="font-serif text-4xl font-extrabold leading-tight tracking-[-0.02em] sm:text-5xl">{nom}</h1>
              {secteurs.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {secteurs.map((secteur) => (
                    <li key={secteur} className="border border-violet-dark/30 px-3 py-1 text-xs font-bold text-violet-dark">
                      {secteur}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-serif text-3xl font-bold text-violet-dark">Le projet</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-main">
              {pitchResume || "La startup n'a pas encore publié de présentation."}
            </p>
          </div>

          <aside className="facet-tr h-fit bg-violet-dark p-8 text-white">
            <h2 className="flex items-center gap-3 font-serif text-2xl font-bold">
              <Lock size={22} className="text-orange-accent" /> Deal Room privée
            </h2>
            <p className="mt-4 leading-relaxed text-white/80">
              Pitch deck, business plan, KPIs et informations financières de {nom}, accessibles sur demande.
            </p>
            {!isInvestor && (
              <p className="mt-4 inline-block bg-white/12 px-3 py-1.5 text-sm font-bold text-white">
                Réservé aux investisseurs inscrits.
              </p>
            )}

            <div className="mt-7">
              {requestStatus === "SUCCESS" ? (
                <p role="status" className="flex items-center gap-3 border border-white/25 bg-white/10 p-4 font-bold">
                  <CheckCircle className="text-green-light" /> Demande envoyée
                </p>
              ) : (
                <>
                  <button
                    onClick={handleRequestAccess}
                    disabled={isRequesting || !isInvestor}
                    className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRequesting && <Loader2 size={17} className="animate-spin" />}
                    Demander l&apos;accès
                  </button>
                  {errorMsg && (
                    <p role="alert" className="mt-3 text-sm font-semibold text-[#ffb4a8]">
                      {errorMsg}
                    </p>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
