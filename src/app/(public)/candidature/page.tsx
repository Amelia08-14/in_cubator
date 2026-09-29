import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Globe, Shield } from "lucide-react";

import PageHero from "@/components/brand/PageHero";
import Reveal from "@/components/brand/Reveal";
import LeadCTA from "@/components/features/home/LeadCTA";

export const metadata: Metadata = {
  title: "Candidater au programme",
  description:
    "Déposez votre candidature au programme d'incubation IN-CUBATOR : un formulaire en cinq étapes, 100 % en ligne.",
};

const BENEFITS = [
  { title: "Sur-mesure", text: "Un suivi personnalisé par des experts, adapté à l'avancement de votre projet." },
  { title: "Ressources", text: "Outils, contenus et infrastructures : le lieu, la connexion, les salles, les équipements." },
  { title: "Réseau", text: "Une connexion directe aux mentors, aux investisseurs et aux leaders de l'écosystème." },
  { title: "Financement", text: "Une préparation solide pour vos levées de fonds, avec une Deal Room sécurisée." },
  { title: "Visibilité", text: "Une vitrine publique pour valoriser votre startup auprès du marché." },
];

const FORM_STEPS = [
  "Identité du projet et de la startup",
  "L'équipe",
  "Secteur et stade d'avancement",
  "Description, problème résolu, besoins",
  "Récapitulatif et soumission",
];

const SECTORS = ["Santé", "Pharma & biotech", "AgriTech", "Entrepreneuriat féminin", "Hôpital et établissements"];

export default function CandidaturePage() {
  return (
    <main>
      <PageHero
        title={<>Votre innovation mérite le bon accompagnement<span className="text-orange-accent">.</span></>}
        text="IN-CUBATOR accompagne les startups à fort impact — santé, pharma, biotech, AgriTech, entrepreneuriat féminin — à chaque étape de leur croissance."
        actions={
          <>
            <Link href="/candidature/formulaire" className="btn btn-primary">
              Commencer ma candidature <ArrowRight size={18} />
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-violet-dark">
              <li className="flex items-center gap-2"><Globe size={17} className="text-orange-deep" /> 100 % en ligne</li>
              <li className="flex items-center gap-2"><Clock size={17} className="text-orange-deep" /> Quelques minutes</li>
              <li className="flex items-center gap-2"><Shield size={17} className="text-orange-deep" /> Données protégées</li>
            </ul>
          </>
        }
        image={{ src: "/photos/gen/candidature.webp", alt: "Une fondatrice travaille sur son ordinateur portable dans un espace de coworking lumineux", position: "50% 30%" }}
        aspect="aspect-[4/4.6]"
      />

      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
              Un programme complet pour accélérer votre startup.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-main">
              Ce que vous obtenez en rejoignant la prochaine promotion.
            </p>
          </Reveal>
          <Reveal as="ul" stagger={0.08} y={28} className="divide-y divide-line border-y border-line">
            {BENEFITS.map((b) => (
              <li key={b.title} className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <h3 className="flex items-center gap-3 font-serif text-xl font-bold text-violet-dark">
                  <span className="hex h-3 w-3 shrink-0 bg-orange-accent" aria-hidden />
                  {b.title}
                </h3>
                <p className="leading-relaxed text-gray-main">{b.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-3xl font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
              Une candidature en cinq étapes.
            </h2>
          </Reveal>
          <Reveal as="ol" stagger={0.1} y={30} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {FORM_STEPS.map((label, i) => (
              <li key={label} className="relative">
                <div className="flex items-center gap-3">
                  <span className="hex flex h-14 w-14 shrink-0 items-center justify-center bg-violet-dark font-serif text-xl font-bold text-white" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < FORM_STEPS.length - 1 && <span className="hidden h-[3px] flex-1 bg-orange-accent/70 lg:block" aria-hidden />}
                </div>
                <p className="mt-4 pr-4 font-serif text-lg font-bold leading-snug text-violet-dark">{label}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-16 flex flex-col gap-6 border-t border-line pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-violet-dark">Nos secteurs clés</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {SECTORS.map((s) => (
                  <li key={s} className="border border-violet-dark/25 bg-white px-4 py-2 text-sm font-bold text-violet-dark">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/candidature/formulaire" className="btn btn-violet self-start lg:self-auto">
              Commencer ma candidature <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <LeadCTA
        title="Une question avant de candidater ?"
        intro="Écrivez-nous : l'équipe vous répond et vous aide à choisir le bon point d'entrée dans le programme."
      />
    </main>
  );
}
