import Image from "next/image";

import CubeMark from "@/components/brand/CubeMark";

type PageHeroProps = {
  title: React.ReactNode;
  text?: React.ReactNode;
  /** Boutons ou liens d'action sous le texte. */
  actions?: React.ReactNode;
  /** Vraie photo ou image éditoriale ; sans image, le titre occupe toute la largeur. */
  image?: { src: string; alt: string; position?: string };
  /** Proportion de l'image (par défaut paysage 4:3). */
  aspect?: string;
  /** Petit repère au-dessus du contenu (fil d'Ariane, lien retour). */
  before?: React.ReactNode;
  cube?: boolean;
};

/**
 * Bandeau d'ouverture des pages intérieures : fond beige, titre violet,
 * facettes sable et image en pan coupé sur un bloc orange (codes IN NETWORK).
 */
export default function PageHero({ title, text, actions, image, aspect = "aspect-[4/3]", before, cube }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-paper pb-16 pt-36 lg:pb-24 lg:pt-44">
      <div
        aria-hidden
        className="absolute right-0 top-0 -z-10 h-full w-[46%] bg-paper-deep"
        style={{ clipPath: "polygon(26% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 -z-10 h-14 w-[26%] bg-sand/70"
        style={{ clipPath: "polygon(0 0, 88% 0, 100% 100%, 0 100%)" }}
      />

      <div
        className={`mx-auto grid w-full max-w-[1320px] items-center gap-12 px-5 sm:px-8 ${
          image ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-14" : ""
        }`}
      >
        <div>
          {before}
          <h1 className="font-serif text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-violet-dark sm:text-6xl lg:text-[4.2rem]">
            {title}
          </h1>
          {text && <p className="mt-7 max-w-xl text-xl leading-relaxed text-gray-main">{text}</p>}
          {actions && <div className="mt-10 flex flex-wrap items-center gap-4">{actions}</div>}
        </div>

        {image && (
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <div
              aria-hidden
              className="absolute -left-4 top-8 h-[88%] w-[88%] bg-orange-accent sm:-left-7"
              style={{ clipPath: "polygon(14% 0, 100% 0, 100% 86%, 86% 100%, 0 100%, 0 14%)" }}
            />
            <div className={`facet-photo relative w-full translate-x-3 overflow-hidden bg-sand shadow-deep sm:translate-x-6 ${aspect}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
                style={image.position ? { objectPosition: image.position } : undefined}
              />
            </div>
            {cube && (
              <CubeMark
                decorative
                className="animate-drift pointer-events-none absolute -bottom-9 -left-2 z-10 h-28 w-28 sm:-left-9 sm:h-36 sm:w-36"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
