import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TextReveal from "@/components/features/public/TextReveal";
import StartupShowcase from "@/components/features/public/StartupShowcase";
import OutCubator from "@/components/features/public/OutCubator";
import HomeHero from "@/components/features/public/HomeHero";
import WhyInCubator from "@/components/features/public/WhyInCubator";

const HOW_IT_WORKS = [
  {
    title: "Candidature structurée",
    desc: "Un questionnaire qui s'adapte à votre stade, pas un formulaire générique.",
    tone: "plain" as const,
  },
  {
    title: "Cohortes rythmées",
    desc: "Des promotions qui avancent ensemble, avec un calendrier clair.",
    tone: "yellow" as const,
  },
  {
    title: "Vitrine publique",
    desc: "Une page dédiée pour présenter votre startup aux investisseurs.",
    tone: "plain" as const,
  },
];

export default async function Home() {
  const dbMentors = await prisma.mentorProfile.findMany({
    where: { actif: true },
    take: 4,
  });

  return (
    <div className="font-sans">
      <HomeHero />

      <WhyInCubator />

      {/* Comment ça marche — bento grid */}
      <section className="w-full bg-warm-cream px-6 py-24 sm:px-10" data-theme="light">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="font-serif text-4xl font-black uppercase leading-[0.95] tracking-tight">
              <span className="text-violet-dark">Comment</span>{" "}
              <span className="text-violet-main">ça marche</span>
            </h2>
            <p className="max-w-sm text-sm text-gray-main">
              Tout ce qu&apos;il faut pour comprendre votre marché, vous entourer et avancer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            <div className="rounded-[1.75rem] border border-black/5 bg-white p-7 lg:row-span-1">
              <h3 className="font-serif text-lg font-bold text-violet-dark">{HOW_IT_WORKS[0].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-main">{HOW_IT_WORKS[0].desc}</p>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-white sm:row-span-2">
              <Image
                src="/idea_bulb.png"
                alt="De l'idée au marché"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-violet-dark/90 to-transparent p-6 pt-16">
                <p className="font-serif text-base font-bold text-white">De l&apos;idée au marché</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-yellow-orange/20 p-7">
              <h3 className="font-serif text-lg font-bold text-violet-dark">{HOW_IT_WORKS[1].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-dark/70">{HOW_IT_WORKS[1].desc}</p>
            </div>

            <div className="rounded-[1.75rem] border border-black/5 bg-white p-7">
              <h3 className="font-serif text-lg font-bold text-violet-dark">{HOW_IT_WORKS[2].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-main">{HOW_IT_WORKS[2].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Startups intro */}
      <section id="vitrine" className="w-full bg-white px-8 pb-8 pt-24" data-theme="light">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-4">
          <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-main">
            <span className="h-px w-8 bg-violet-main" />
            Vitrine
          </span>
          <h2 className="max-w-2xl font-serif text-3xl font-extrabold leading-tight text-violet-dark md:text-4xl">
            Des projets qui réinventent demain.
          </h2>
        </div>
      </section>

      <StartupShowcase />

      {/* Mentors Preview */}
      {dbMentors.length > 0 && (
        <section id="mentors" className="w-full bg-warm-cream px-8 py-24" data-theme="light">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center">
            <div className="mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
              <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-main">
                <span className="h-px w-8 bg-violet-main" />
                Nos experts
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-violet-dark md:text-4xl">
                Rencontrez ceux qui vous accompagnent.
              </h2>
              <p className="text-base text-gray-main">
                Des professionnels expérimentés pour vous guider de l&apos;idéation à la levée de fonds.
              </p>
            </div>

            <div className="mb-16 grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-4">
              {dbMentors.map((mentor) => {
                const expertiseArray = Array.isArray(mentor.expertise) ? (mentor.expertise as string[]) : [];
                const role = expertiseArray.length > 0 ? expertiseArray[0] : "Expert";

                return (
                  <div
                    key={mentor.id}
                    className="flex flex-col items-center rounded-[1.75rem] border border-black/5 bg-white p-8 text-center shadow-[0_15px_40px_rgba(71,41,92,0.06)] transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-full border-2 border-violet-main/20 bg-gray-50">
                      <Image src="/placeholder-avatar.png" alt={mentor.nomComplet || "Mentor avatar"} fill className="object-cover" />
                    </div>

                    <h3 className="mb-1 font-serif text-lg font-bold text-violet-dark">{mentor.nomComplet}</h3>
                    <p className="mb-4 text-xs font-bold uppercase tracking-wide text-violet-main">{role}</p>

                    <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-main">
                      {mentor.bio}
                    </p>

                    <div className="mt-auto flex gap-3 text-gray-main">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[10px] transition-colors hover:border-violet-main hover:text-violet-main">in</div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[10px] transition-colors hover:border-violet-main hover:text-violet-main">tw</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/mentors"
              className="rounded-full bg-violet-dark px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(71,41,92,0.2)] transition-all hover:-translate-y-0.5 hover:bg-violet-main"
            >
              Découvrir tous les mentors
            </Link>
          </div>
        </section>
      )}

      {/* Out-Cubator teaser lead-in */}
      <section id="out-cubator" className="w-full bg-white px-8 pt-24 pb-0" data-theme="light">
        <div className="mx-auto w-full max-w-[1200px]">
          <TextReveal
            superTitle="NOS ALUMNI"
            text="Des startups qui continuent d'aller loin."
            subtitle="Découvrez quelques startups qui ont terminé le programme IN-CUBATOR et qui créent aujourd'hui un impact réel."
            className="mx-auto flex min-h-0 w-full flex-col items-center py-0 text-center"
          />
        </div>
      </section>

      <OutCubator />
    </div>
  );
}
