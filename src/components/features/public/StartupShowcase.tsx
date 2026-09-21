import React from 'react';
import Image from 'next/image';

const STATUS_STYLES: Record<string, string> = {
  "EN LIGNE": "bg-green-main/10 text-green-main",
  "BETA": "bg-yellow-orange/15 text-[#9a6a00]",
  "LANCEMENT": "bg-blue-main/10 text-blue-main",
};

const startups = [
  {
    id: 1,
    name: "NexaFlow",
    status: "EN LIGNE",
    title: "L'automatisation intelligente pour les équipes agiles",
    desc: "Plateforme no-code propulsée par l'IA pour orchestrer l'ensemble de vos workflows internes en un clin d'œil.",
    product: "SaaS Dashboard",
    market: "Global B2B",
    priority: "Productivité",
    surface: "Web App",
    img: "/startup_fintech.png"
  },
  {
    id: 2,
    name: "LuminaHealth",
    status: "BETA",
    title: "La télémédecine prédictive au service des patients",
    desc: "Suivi médical en temps réel analysant les biomarqueurs pour anticiper les urgences de santé et améliorer le suivi post-opératoire.",
    product: "IoT & Mobile App",
    market: "Europe",
    priority: "Healthcare",
    surface: "Mobile / Watch",
    img: "/startup_health.png"
  },
  {
    id: 3,
    name: "GreenChain",
    status: "LANCEMENT",
    title: "Traçabilité carbone certifiée par la blockchain",
    desc: "Une solution complète pour mesurer, optimiser et certifier l'empreinte carbone de votre chaîne d'approvisionnement en temps réel.",
    product: "API & Dashboard",
    market: "Industrie / Logistique",
    priority: "Sustainability",
    surface: "Web App",
    img: "/startup_edtech.png"
  }
];

export default function StartupShowcase() {
  return (
    <div data-theme="light" className="relative w-full overflow-hidden bg-white px-4 py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        {startups.map((startup) => (
          <div
            key={startup.id}
            className="flex w-full flex-col gap-10 overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_15px_45px_rgba(71,41,92,0.06)] lg:flex-row lg:gap-16 lg:p-12"
          >
            {/* Left Column (Text & Data) */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                {/* Header */}
                <div className="mb-8 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <h4 className="text-xl font-bold tracking-tight text-violet-dark">{startup.name}</h4>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase sm:text-xs ${STATUS_STYLES[startup.status]}`}
                  >
                    {startup.status}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="mb-6 font-serif text-3xl font-extrabold leading-[1.15] tracking-tight text-violet-dark md:text-4xl lg:text-[2.75rem]">
                  {startup.title}
                </h3>
                <p className="mb-12 max-w-xl font-sans text-base text-gray-500 md:text-lg">
                  {startup.desc}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 border-y border-gray-100 py-6 mb-8">
                  <div>
                    <p className="mb-2 text-xs text-gray-400">Produit</p>
                    <p className="text-base font-semibold text-violet-dark">{startup.product}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-400">Marché</p>
                    <p className="text-base font-semibold text-violet-dark">{startup.market}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-400">Priorité</p>
                    <p className="text-base font-semibold text-violet-dark">{startup.priority}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-400">Surface</p>
                    <p className="text-base font-semibold text-violet-dark">{startup.surface}</p>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-violet-dark sm:text-xs">
                  <a href="#" className="group flex items-center gap-2 transition-colors hover:text-violet-main">
                    Voir l&apos;étude <span className="text-lg leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </a>
                  <a href="#" className="group flex items-center gap-2 transition-colors hover:text-violet-main">
                    Site en ligne <span className="text-lg leading-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column (Visual) */}
            <div className="relative min-h-[240px] w-full overflow-hidden rounded-[1.5rem] lg:w-[45%]">
              <Image
                src={startup.img}
                alt={startup.name}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
