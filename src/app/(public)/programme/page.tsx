import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PageHero from "@/components/brand/PageHero";
import Reveal from "@/components/brand/Reveal";
import LeadCTA from "@/components/features/home/LeadCTA";
import { EQUIPMENTS, GROUP_SERVICES, PROGRAMME_STEPS } from "@/lib/content/programme";

export const metadata: Metadata = {
  title: "Le programme d'incubation",
  description:
    "Six étapes pour transformer une idée en projet concret : diagnostic, accompagnement, test terrain, réseau, formations, lancement.",
};

export default function ProgrammePage() {
  return (
    <main>
      <PageHero
        title={<>Le programme d&apos;incubation<span className="text-orange-accent">.</span></>}
        text="Découvrez comment notre programme transforme les idées en projets concrets : un suivi personnalisé, des conseils ciblés, des ateliers pratiques et un réseau pour accélérer votre croissance."
        actions={
          <>
            <Link href="/candidature" className="btn btn-primary">
              Candidater au programme <ArrowRight size={18} />
            </Link>
            <a href="#etapes" className="btn btn-ghost-dark">
              Les six étapes
            </a>
          </>
        }
        image={{ src: "/photos/roadmap-whiteboard.webp", alt: "Une main désigne une feuille de route Q1 à Q4 sur un tableau blanc", position: "30% 50%" }}
        cube
      />

      <section id="etapes" className="bg-cream py-20 lg:py-28">
        <ol className="mx-auto flex w-full max-w-[1320px] flex-col gap-24 px-5 sm:px-8 lg:gap-32">
          {PROGRAMME_STEPS.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.n} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <Reveal className={flip ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-5">
                    <span
                      className="hex flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center bg-violet-dark font-serif text-3xl font-bold text-white"
                      aria-hidden
                    >
                      {String(s.n).padStart(2, "0")}
                    </span>
                    <span className="h-[3px] flex-1 bg-orange-accent" aria-hidden />
                  </div>
                  <h2 className="mt-7 font-serif text-3xl font-extrabold leading-tight text-violet-dark sm:text-4xl">
                    {s.title}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-gray-main">{s.summary}</p>
                  <ul className="mt-6 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 font-semibold text-violet-dark">
                        <span className="hex h-2.5 w-2.5 shrink-0 bg-orange-accent" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal y={50} className={flip ? "lg:order-1" : ""}>
                  <div className={`relative aspect-[4/3] overflow-hidden bg-sand shadow-deep ${flip ? "facet-bl" : "facet-tr"}`}>
                    <Image
                      src={s.photo}
                      alt={s.photoAlt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-3xl font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
              Les services du groupe, à portée de main.
            </h2>
          </Reveal>
          <Reveal as="ul" stagger={0.08} y={28} className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {GROUP_SERVICES.map((s) => (
              <li key={s.name} className="border-t-2 border-violet-dark py-7">
                <h3 className="font-serif text-xl font-bold text-violet-dark">{s.name}</h3>
                <p className="mt-3 leading-relaxed text-gray-main">{s.text}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h3 className="font-serif text-3xl font-bold leading-tight text-violet-dark">
              Un cadre de travail complet, accessible 24h/7j.
            </h3>
            <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {EQUIPMENTS.map((e) => (
                <li key={e.name}>
                  <p className="font-serif text-lg font-bold text-violet-dark">{e.name}</p>
                  <p className="mt-1 text-gray-main">{e.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <LeadCTA
        title="Prêt à démarrer le parcours ?"
        intro="Présentez-nous votre projet : nous vous indiquons l'étape par laquelle commencer."
        source="SITE_WEB"
      />
    </main>
  );
}
