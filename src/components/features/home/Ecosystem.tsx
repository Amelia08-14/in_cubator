import Image from "next/image";

import Reveal from "@/components/brand/Reveal";
import { EQUIPMENTS, GROUP_SERVICES } from "@/lib/content/programme";

export default function Ecosystem() {
  const marquee = [...EQUIPMENTS, ...EQUIPMENTS];

  return (
    <section id="ecosysteme" className="relative overflow-hidden bg-paper pt-24 lg:pt-32">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
            Un lieu, un groupe, un réseau. Tout sous le même toit.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-main">
            Au cœur d&apos;Alger, à deux pas des banques, de l&apos;APC et des impôts, IN NETWORK
            accueille les projets dans un espace pensé pour la collaboration : bureaux privés,
            open space, salles de réunion et de formation, événements et afterworks.
          </p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-gray-main">
            Ici, on ne travaille pas seul. On avance collectivement.
          </p>
        </Reveal>

        <Reveal className="relative grid grid-cols-6 grid-rows-[auto_auto] gap-4" stagger={0.12} y={48}>
          <div className="facet-tr relative col-span-4 row-span-2 aspect-[3/4.1] overflow-hidden bg-sand shadow-lift">
            <Image
              src="/photos/salle-formation.webp"
              alt="La salle de formation équipée d'IN NETWORK, avec sa grande table de travail"
              fill
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="relative col-span-2 aspect-square overflow-hidden bg-sand">
            <Image
              src="/photos/bureaux-prives.webp"
              alt="Bureaux privés vitrés"
              fill
              sizes="(min-width: 1024px) 16vw, 30vw"
              className="object-cover"
            />
          </div>
          <div className="relative col-span-2 aspect-[2/3] overflow-hidden bg-sand shadow-lift">
            <Image
              src="/photos/terrasse.webp"
              alt="Le jardin terrasse de 150 m² d'IN NETWORK, sous sa pergola en bois"
              fill
              sizes="(min-width: 1024px) 16vw, 30vw"
              className="object-cover object-[35%_50%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-orange-accent p-3.5 text-white">
              <p className="font-serif text-sm font-bold leading-snug">Jardin terrasse de 150&nbsp;m²</p>
              <p className="mt-0.5 text-xs font-semibold leading-snug">pour se ressourcer et échanger</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Services du groupe : liste éditoriale, pas de grille de cartes */}
      <div className="mx-auto mt-24 w-full max-w-[1320px] px-5 sm:px-8 lg:mt-32">
        <Reveal className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h3 className="max-w-xl font-serif text-3xl font-bold leading-tight text-violet-dark sm:text-4xl">
            Tout ce dont une startup a besoin pour exister légalement et grandir.
          </h3>
          <p className="max-w-sm text-gray-main">
            Les services de La Maison IN Groupe, disponibles dès l&apos;incubation.
          </p>
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.08}
          y={28}
          className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {GROUP_SERVICES.map((s) => (
            <li key={s.name} className="group border-t-2 border-violet-dark py-7">
              <h4 className="flex items-center gap-3 font-serif text-xl font-bold text-violet-dark">
                <span
                  aria-hidden
                  className="hex h-3 w-3 bg-orange-accent transition-transform duration-500 group-hover:rotate-90 group-hover:scale-125"
                />
                {s.name}
              </h4>
              <p className="mt-3 leading-relaxed text-gray-main">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>

      {/* Équipements en défilement continu */}
      <div className="relative mt-16 overflow-hidden border-y border-sand bg-paper-deep py-7" aria-label="Équipements et services">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {marquee.map((e, i) => (
            <span key={`${e.name}-${i}`} className="flex items-center gap-10 font-serif text-2xl font-bold text-violet-dark">
              {e.name}
              <span aria-hidden className="hex h-3 w-3 bg-orange-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
