"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Lock, RotateCcw, Star } from "lucide-react";

export type PublicMentor = {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  secteurs: string[];
  rating: number;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function MentorsExplorer({ mentors }: { mentors: PublicMentor[] }) {
  const [secteur, setSecteur] = useState("");
  const [expertise, setExpertise] = useState("");

  const secteurs = useMemo(() => [...new Set(mentors.flatMap((m) => m.secteurs))].sort(), [mentors]);
  const expertises = useMemo(() => [...new Set(mentors.flatMap((m) => m.expertise))].sort(), [mentors]);

  const visible = mentors.filter(
    (m) => (!secteur || m.secteurs.includes(secteur)) && (!expertise || m.expertise.includes(expertise)),
  );

  return (
    <>
      {(secteurs.length > 0 || expertises.length > 0) && (
        <div className="flex flex-col gap-4 border border-line bg-white p-5 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Secteur</span>
            <select value={secteur} onChange={(e) => setSecteur(e.target.value)} className="field">
              <option value="">Tous les secteurs</option>
              {secteurs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block flex-1">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Expertise</span>
            <select value={expertise} onChange={(e) => setExpertise(e.target.value)} className="field">
              <option value="">Toutes les expertises</option>
              {expertises.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setSecteur("");
              setExpertise("");
            }}
            className="group flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-violet-dark transition-colors hover:text-orange-deep"
          >
            <RotateCcw size={16} className="transition-transform duration-300 group-hover:-rotate-90" />
            Réinitialiser
          </button>
        </div>
      )}

      {mentors.length === 0 ? (
        <p className="mt-10 border border-dashed border-line bg-white px-6 py-14 text-center text-gray-main">
          Nos experts rejoignent le réseau au fil des promotions. Revenez bientôt.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-line bg-white px-6 py-14 text-center text-gray-main">
          Aucun mentor ne correspond à ces critères.
        </p>
      ) : (
        <ul className="mt-10 grid gap-x-8 gap-y-2 md:grid-cols-2">
          {visible.map((m) => (
            <li key={m.id} className="group grid grid-cols-[auto_1fr] gap-5 border-t-2 border-violet-dark py-7">
              <span
                aria-hidden
                className="hex flex h-[4.5rem] w-[4.5rem] items-center justify-center bg-violet-dark font-serif text-xl font-bold text-white transition-colors duration-500 group-hover:bg-orange-accent"
              >
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-2xl font-bold text-violet-dark">{m.name}</h3>
                <p className="mt-1 text-sm font-semibold text-orange-deep">{m.role}</p>
                {m.bio && <p className="mt-3 line-clamp-3 leading-relaxed text-gray-main">{m.bio}</p>}
                {m.secteurs.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {m.secteurs.slice(0, 3).map((s) => (
                      <li key={s} className="border border-violet-dark/25 px-2.5 py-1 text-xs font-bold text-violet-dark">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {m.rating > 0 && (
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ink">
                    <Star size={15} className="fill-yellow-orange text-yellow-orange" />
                    <span className="tabular">{m.rating.toFixed(1)}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="facet-tr mt-16 flex flex-col items-start justify-between gap-6 bg-violet-dark p-8 text-white md:flex-row md:items-center md:p-10">
        <div className="flex items-start gap-5">
          <Lock size={26} className="mt-1 shrink-0 text-orange-accent" />
          <div>
            <h2 className="font-serif text-2xl font-bold">Réservez une session avec un mentor.</h2>
            <p className="mt-2 max-w-xl leading-relaxed text-white/80">
              Le marketplace de mentoring est ouvert aux startups du programme : connectez-vous ou créez votre compte pour réserver.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/connexion" className="btn btn-primary">
            Se connecter <ArrowRight size={17} />
          </Link>
          <Link href="/inscription" className="btn btn-ghost-light">
            Créer un compte
          </Link>
        </div>
      </div>
    </>
  );
}
