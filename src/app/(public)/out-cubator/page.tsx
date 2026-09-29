import type { Metadata } from "next";

import PageHero from "@/components/brand/PageHero";
import Reveal from "@/components/brand/Reveal";
import LeadCTA from "@/components/features/home/LeadCTA";
import { DIASPORA_PACKS } from "@/lib/content/programme";

export const metadata: Metadata = {
  title: "Out-Cubator",
  description:
    "Out-Cubator conçoit, structure et pilote des systèmes d'incubation durables, et accompagne la diaspora qui souhaite entreprendre en Algérie.",
};

const PURPOSE = [
  {
    title: "Le problème adressé",
    text: "Out-Cubator a été créé pour répondre aux limites des dispositifs d'appui actuels, souvent fragmentés, dépendants et orientés court terme.",
  },
  {
    title: "Notre rôle : tête de réseau",
    text: "Nous concevons des modèles d'incubation reproductibles et relions les territoires, incubateurs et acteurs autour d'une gouvernance commune, tout en préservant leur autonomie et leurs racines locales.",
  },
  {
    title: "Notre vision long terme",
    text: "Construire des écosystèmes entrepreneuriaux solides, cohérents et pérennes, capables de fonctionner de manière autonome dans la durée.",
  },
  {
    title: "Notre impact ultime",
    text: "Accompagner la création d'infrastructures entrepreneuriales résilientes, génératrices d'un impact durable et porteuses de modèles de développement transmissibles aux générations futures.",
  },
];

const METHOD = [
  { title: "Diagnostic", text: "Comprendre les enjeux, les acteurs et le potentiel du territoire." },
  { title: "Structuration", text: "Concevoir des modèles, processus et outils adaptés au contexte local." },
  { title: "Accompagnement", text: "Renforcer les capacités des équipes et des structures pour un déploiement efficace." },
  { title: "Évaluation", text: "Mesurer l'impact et la performance pour guider les décisions." },
  { title: "Amélioration continue", text: "Capitaliser, ajuster et innover pour une amélioration continue des systèmes." },
];

const VALUES = [
  { title: "Durabilité", text: "Des systèmes conçus pour durer et évoluer dans le temps." },
  { title: "Cohérence", text: "Des initiatives alignées sur les besoins réels des territoires." },
  { title: "Autonomie", text: "Renforcer l'autonomie locale tout en favorisant la coopération." },
  { title: "Adaptabilité", text: "Des modèles flexibles, capables de s'adapter à chaque contexte." },
  { title: "Intégrité", text: "Agir avec transparence, éthique et responsabilité dans chaque démarche." },
];

export default function OutCubatorPage() {
  return (
    <main>
      <PageHero
        title={<>Concevoir aujourd&apos;hui les écosystèmes de demain<span className="text-orange-accent">.</span></>}
        text="Out-Cubator est une structure stratégique dédiée à la conception, à la structuration et au pilotage de systèmes d'incubation durables."
        actions={
          <>
            <a href="#packs" className="btn btn-primary">Entreprendre depuis l&apos;étranger</a>
            <a href="#contact" className="btn btn-ghost-dark">Nous contacter</a>
          </>
        }
        image={{ src: "/photos/gen/alger.webp", alt: "La baie d'Alger au coucher du soleil, avec le Maqam Echahid sur les hauteurs" }}
        aspect="aspect-[16/11]"
      />

      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-3xl font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
              Notre raison d&apos;être.
            </h2>
          </Reveal>
          <Reveal as="dl" stagger={0.1} y={30} className="mt-12 grid gap-x-14 gap-y-2 md:grid-cols-2">
            {PURPOSE.map((p) => (
              <div key={p.title} className="border-t-2 border-violet-dark py-7">
                <dt className="flex items-center gap-3 font-serif text-xl font-bold text-violet-dark">
                  <span className="hex h-3 w-3 shrink-0 bg-orange-accent" aria-hidden />
                  {p.title}
                </dt>
                <dd className="mt-3 leading-relaxed text-gray-main">{p.text}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
              Notre méthodologie.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-main">
              Une approche systémique et itérative pour concevoir, structurer et piloter des systèmes
              d&apos;incubation performants et durables.
            </p>
          </Reveal>
          <Reveal as="ol" stagger={0.1} y={30} className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {METHOD.map((m, i) => (
              <li key={m.title}>
                <div className="flex items-center gap-3">
                  <span className="hex flex h-14 w-14 shrink-0 items-center justify-center bg-violet-dark font-serif text-xl font-bold text-white" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < METHOD.length - 1 && <span className="hidden h-[3px] flex-1 bg-orange-accent/70 lg:block" aria-hidden />}
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-violet-dark">{m.title}</h3>
                <p className="mt-2 pr-3 leading-relaxed text-gray-main">{m.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark sm:text-5xl">
              Notre philosophie et nos valeurs.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-main">
              Nous plaçons la qualité des cadres, la cohérence des initiatives et la pérennité des
              organisations au-dessus de la croissance rapide ou de la visibilité immédiate.
            </p>
          </Reveal>
          <Reveal as="ul" stagger={0.08} y={26} className="divide-y divide-line border-y border-line">
            {VALUES.map((v) => (
              <li key={v.title} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <h3 className="font-serif text-xl font-bold text-violet-dark">{v.title}</h3>
                <p className="leading-relaxed text-gray-main">{v.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="packs" className="relative isolate overflow-hidden bg-paper-deep py-20 text-violet-dark lg:py-28">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 -z-10 w-[30%] bg-sand/55"
          style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
        />
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="font-serif text-4xl font-extrabold leading-[1.08] sm:text-5xl">
              Entreprendre depuis l&apos;étranger.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-main">
              Prêts à lancer votre projet en Algérie, où que vous soyez&nbsp;? Nos packs clés en main
              pour la communauté nationale à l&apos;étranger vous accompagnent à chaque étape de la
              création d&apos;entreprise.
            </p>
          </Reveal>

          <Reveal as="ul" stagger={0.09} y={28} className="mt-12 divide-y divide-sand border-y border-sand">
            {DIASPORA_PACKS.map((pack, i) => (
              <li key={pack.name} className="grid items-center gap-4 py-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
                <div className="flex items-center gap-4">
                  <span
                    className={`hex flex h-14 w-14 shrink-0 items-center justify-center font-serif text-xl font-bold ${
                      i < 2 ? "bg-orange-accent text-white" : "bg-violet-dark text-white"
                    }`}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl font-bold">{pack.name}</h3>
                    <p className="tabular mt-0.5 text-lg font-bold text-orange-deep">{pack.price}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap content-center gap-x-8 gap-y-2 text-violet-dark">
                  {pack.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 leading-snug">
                      <span className="hex mt-1.5 h-2.5 w-2.5 shrink-0 bg-orange-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>
          <p className="mt-6 text-sm text-gray-main">
            Tarifs en dinars algériens, tels que présentés dans le catalogue IN NETWORK. Les packs 03 à 05
            se composent sur devis.
          </p>
        </div>
      </section>

      <LeadCTA
        title="Bâtissons ensemble des écosystèmes qui durent."
        intro="Out-Cubator œuvre pour un futur où chaque territoire peut faire émerger, soutenir et transmettre ses talents. Parlez-nous de votre projet."
        defaultProfile="DIASPORA"
      />
    </main>
  );
}
