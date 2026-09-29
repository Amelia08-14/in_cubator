import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "@/components/brand/Reveal";

export type StripMentor = {
  id: string;
  nomComplet: string;
  role: string;
  bio: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function MentorsStrip({ mentors }: { mentors: StripMentor[] }) {
  if (mentors.length === 0) return null;

  return (
    <section id="mentors" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto grid w-full max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
            Des experts qui ont déjà fait le chemin.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-main">
            Des professionnels pour vous guider, de l&apos;idéation à la levée de fonds. Réservez
            un créneau directement depuis votre espace startup.
          </p>
          <Link href="/mentors" className="btn btn-violet mt-9">
            Voir tous les mentors <ArrowRight size={18} />
          </Link>
        </Reveal>

        <Reveal as="ul" stagger={0.1} y={36} className="divide-y divide-line border-y border-line">
          {mentors.map((m) => (
            <li key={m.id} className="group grid grid-cols-[auto_1fr] items-start gap-5 py-7 sm:gap-7">
              <span
                aria-hidden
                className="hex flex h-16 w-16 items-center justify-center bg-violet-dark font-serif text-xl font-bold text-white transition-colors duration-500 group-hover:bg-orange-accent sm:h-[4.5rem] sm:w-[4.5rem]"
              >
                {initials(m.nomComplet)}
              </span>
              <div>
                <h3 className="font-serif text-2xl font-bold text-violet-dark">{m.nomComplet}</h3>
                <p className="mt-1 text-sm font-semibold text-orange-deep">{m.role}</p>
                <p className="mt-3 line-clamp-2 max-w-2xl leading-relaxed text-gray-main">{m.bio}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
