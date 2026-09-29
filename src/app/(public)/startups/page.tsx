import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import PageHero from "@/components/brand/PageHero";

export const metadata: Metadata = {
  title: "Startups accompagnées",
  description: "Les startups du programme IN-CUBATOR, visibles des investisseurs et des partenaires.",
};
export const dynamic = "force-dynamic";

const STADE: Record<string, string> = {
  IDEE: "Idée",
  PROTOTYPE: "Prototype",
  EARLY_TRACTION: "Premières traction",
  SCALE: "Croissance",
};

export default async function PublicStartupsDirectory() {
  const startups = await prisma.startupProfile.findMany({
    where: { visiblePublic: true },
    orderBy: { nom: "asc" },
  });

  return (
    <main>
      <PageHero
        title={<>Les startups qui avancent avec nous<span className="text-orange-accent">.</span></>}
        text="Explorez les projets accompagnés par le programme et connectez-vous avec leurs fondateurs."
        image={{ src: "/photos/gen/startups.webp", alt: "Des mains tiennent un prototype électronique dans un atelier de startup" }}
      />

      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          {startups.length === 0 ? (
            <div className="facet-tr bg-violet-dark p-10 text-white">
              <h2 className="font-serif text-3xl font-bold">La vitrine se remplit avec chaque promotion.</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Les startups admises au programme y publient leur profil, visible des investisseurs.
              </p>
              <Link href="/candidature" className="btn btn-primary mt-8">
                Candidater au programme <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {startups.map((startup) => {
                const secteurs = Array.isArray(startup.secteurs) ? (startup.secteurs as string[]) : [];
                return (
                  <li key={startup.id}>
                    <Link
                      href={`/startups/${startup.id}`}
                      className="group flex h-full flex-col bg-white shadow-lift transition-transform duration-500 hover:-translate-y-1.5"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                        {startup.logoUrl ? (
                          <Image src={startup.logoUrl} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="hex flex h-20 w-20 items-center justify-center bg-violet-dark font-serif text-4xl font-bold text-white">
                              {startup.nom.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="absolute left-0 top-0 bg-orange-accent px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                          {STADE[startup.stade] ?? startup.stade}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-7">
                        <h2 className="font-serif text-2xl font-bold text-violet-dark">{startup.nom}</h2>
                        <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-gray-main">
                          {startup.pitchResume || "Description à venir."}
                        </p>
                        {secteurs.length > 0 && (
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {secteurs.slice(0, 3).map((s) => (
                              <li key={s} className="border border-violet-dark/25 px-2.5 py-1 text-xs font-bold text-violet-dark">
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-violet-dark transition-all group-hover:gap-3 group-hover:text-orange-deep">
                          Voir le profil <ArrowRight size={16} />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
