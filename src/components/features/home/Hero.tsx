"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

import HeroVideo from "@/components/brand/HeroVideo";

// Les six piliers montrés par la vidéo (carte de l'Algérie et six cartes reliées).
const PILIERS = ["Accompagnement", "Financement", "Mentorat", "Formation", "Mise en réseau", "Développement"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Seuls le texte et les boutons s'animent. Rien ne doit animer un ancêtre de la
    // vidéo : l'opacité ou la transformation d'un parent isolerait son mélange
    // (mix-blend-mode) et ferait réapparaître le fond blanc.
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-line]", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
        .from("[data-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.1, clearProps: "transform,opacity" }, 0.55);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-x-clip overflow-y-visible bg-paper text-violet-dark">
      <div
        aria-hidden
        className="absolute bottom-0 left-0 -z-10 h-24 w-[34%] bg-sand/70"
        style={{ clipPath: "polygon(0 0, 88% 0, 100% 100%, 0 100%)" }}
      />

      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-6 px-5 pb-14 pt-[8.5rem] sm:px-8 lg:min-h-[100svh] lg:grid-cols-[1fr_1.08fr] lg:gap-4 lg:pb-16 lg:pt-28">
        <div className="relative z-10">
          <h1 className="font-serif font-extrabold leading-[1.02] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-1">
              <span data-line className="block text-[2.6rem] font-medium text-violet-mid sm:text-6xl lg:text-[4.2rem]">
                De l&apos;idée
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span data-line className="block text-[2.9rem] sm:text-[4.2rem] lg:text-[5.1rem]">
                au projet
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span data-line className="block text-[2.9rem] sm:text-[4.2rem] lg:text-[5.1rem]">
                concret<span className="text-orange-accent">.</span>
              </span>
            </span>
          </h1>

          <p data-fade className="mt-8 max-w-xl text-lg leading-relaxed text-gray-main">
            IN-CUBATOR réunit, autour de votre projet, l&apos;accompagnement, le mentorat, la
            formation, le financement, la mise en réseau et le développement. Un programme en six
            étapes, à Hydra (Alger) et dans tout l&apos;écosystème IN NETWORK.
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/candidature" className="btn btn-primary">
              Candidater au programme
              <ArrowRight size={18} />
            </Link>
            <Link href="/programme" className="btn btn-ghost-dark">
              Découvrir le parcours
            </Link>
          </div>

          <dl data-fade className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-sand pt-6 text-sm">
            <div>
              <dt className="font-serif font-bold">6 étapes</dt>
              <dd className="mt-0.5 text-gray-main">du diagnostic au lancement</dd>
            </div>
            <div>
              <dt className="font-serif font-bold">+250 entreprises</dt>
              <dd className="mt-0.5 text-gray-main">et +20 startups accompagnées</dd>
            </div>
            <div>
              <dt className="font-serif font-bold">Accès 24h/7j</dt>
              <dd className="mt-0.5 text-gray-main">à Hydra, Alger</dd>
            </div>
          </dl>
        </div>

        {/* Vidéo sans cadre ni fond : son blanc se fond dans le beige de la section. */}
        <div className="relative mx-auto w-full max-w-[640px] lg:mx-0 lg:-ml-[2%] lg:-mr-[14%] lg:w-[116%] lg:max-w-none">
          <HeroVideo
            src="/videos/hero_video_incubator.web.mp4"
            poster="/videos/hero_video_incubator-poster.webp"
            label={`Carte de l'Algérie au centre de laquelle le cube IN-CUBATOR est relié à six cartes : ${PILIERS.join(", ")}`}
            className="animate-drift block aspect-square w-full object-cover mix-blend-multiply"
          />
        </div>
      </div>
    </section>
  );
}
