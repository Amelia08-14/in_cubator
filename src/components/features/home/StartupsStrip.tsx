import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "@/components/brand/Reveal";

export type StripStartup = {
  id: string;
  nom: string;
  secteur: string;
  stade: string;
  description: string;
  logoUrl: string | null;
};

const STADE_LABEL: Record<string, string> = {
  IDEE: "Idée",
  PROTOTYPE: "Prototype",
  EARLY_TRACTION: "Premières traction",
  SCALE: "Croissance",
};

export function stadeLabel(stade: string) {
  return STADE_LABEL[stade] ?? stade;
}

export default function StartupsStrip({ startups }: { startups: StripStartup[] }) {
  return (
    <section id="vitrine" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
            Les startups qui avancent avec nous.
          </h2>
          <Link href="/startups" className="btn btn-ghost-dark self-start lg:self-auto">
            Toute la vitrine <ArrowRight size={18} />
          </Link>
        </Reveal>

        {startups.length > 0 ? (
          <Reveal as="ul" stagger={0.1} y={40} className="mt-14 grid gap-6 md:grid-cols-3">
            {startups.map((s, i) => (
              <li key={s.id} className={i === 1 ? "md:mt-10" : ""}>
                <Link
                  href={`/startups/${s.id}`}
                  className="group flex h-full flex-col bg-white p-7 shadow-lift transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-violet-dark font-serif text-xl font-bold text-white hex">
                      {s.logoUrl ? (
                        <Image src={s.logoUrl} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        s.nom.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-violet-dark">{s.nom}</h3>
                      <p className="text-sm text-gray-main">{s.secteur}</p>
                    </div>
                  </div>
                  <p className="mt-5 line-clamp-4 leading-relaxed text-gray-main">{s.description}</p>
                  <span className="mt-auto pt-6 text-sm font-bold text-violet-dark">
                    <span className="mr-2 inline-block bg-orange-accent px-2 py-1 text-xs uppercase tracking-wide text-white">
                      {stadeLabel(s.stade)}
                    </span>
                    <span className="inline-flex items-center gap-1 transition-all group-hover:gap-2">
                      Voir le profil <ArrowRight size={15} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            {startups.length < 3 && (
              <li className={startups.length === 1 ? "md:col-span-2" : ""}>
                <div className="facet-tr flex h-full flex-col justify-between gap-8 bg-violet-dark p-8 text-white sm:p-10">
                  <div>
                    <h3 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                      Votre startup peut être la prochaine.
                    </h3>
                    <p className="mt-4 max-w-lg leading-relaxed text-white/80">
                      Un profil public, visible des investisseurs, dès votre admission dans le
                      programme.
                    </p>
                  </div>
                  <Link href="/candidature" className="btn btn-primary self-start">
                    Déposer ma candidature <ArrowRight size={18} />
                  </Link>
                </div>
              </li>
            )}
          </Reveal>
        ) : (
          <Reveal className="facet-tr mt-14 grid gap-8 bg-violet-dark p-8 text-white sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h3 className="font-serif text-3xl font-bold leading-tight">
                La prochaine promotion se prépare.
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Les startups accompagnées apparaîtront ici avec leur profil public, visible des
                investisseurs. La vôtre pourrait être la première.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Link href="/candidature" className="btn btn-primary">
                Déposer ma candidature <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
