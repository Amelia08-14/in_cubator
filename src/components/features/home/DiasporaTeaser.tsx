import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "@/components/brand/Reveal";

export default function DiasporaTeaser() {
  return (
    <section className="relative isolate overflow-hidden bg-paper-deep">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-10 w-[36%] bg-sand/55"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <Reveal y={50} className="relative">
          <div
            aria-hidden
            className="absolute -bottom-5 -left-5 h-[70%] w-[42%] bg-violet-dark"
            style={{ clipPath: "polygon(0 14%, 14% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div className="facet-photo relative aspect-[16/11] overflow-hidden bg-sand shadow-deep">
            <Image
              src="/photos/gen/alger.webp"
              alt="La baie d'Alger au coucher du soleil, avec le Maqam Echahid sur les hauteurs"
              fill
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal>
          <h2 className="font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
            Entreprendre en Algérie, où que vous soyez.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-main">
            L&apos;incubateur accompagne aussi la diaspora qui souhaite s&apos;engager, investir
            ou créer dans le pays. Des packs clés en main : domiciliation, création juridique
            d&apos;entreprise, comptabilité, secrétariat, marketing.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/out-cubator#packs" className="btn btn-primary">
              Découvrir les packs <ArrowRight size={18} />
            </Link>
            <Link href="/candidature" className="btn btn-ghost-dark">
              Candidater à distance
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
