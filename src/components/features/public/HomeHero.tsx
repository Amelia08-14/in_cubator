import Link from "next/link";

export default function HomeHero() {
  return (
    <div id="candidature" className="relative overflow-hidden bg-white" data-theme="light">
      {/* Soft wash, top only — like a light color smear behind the big type */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_60%_60%_at_20%_0%,rgba(150,69,148,0.14),transparent_60%),radial-gradient(ellipse_50%_50%_at_80%_10%,rgba(255,194,90,0.16),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-[1300px] px-6 pt-36 sm:px-10 lg:pt-44">
        {/* Massive display headline with floating card overlapping it */}
        <div className="relative pb-0 sm:pb-44 lg:pb-32">
          <h1 className="select-none font-serif font-black uppercase leading-[0.9] tracking-tight text-violet-dark">
            <span className="block text-[2.3rem] sm:text-[5.5rem] lg:text-[7.5rem]">Construisez</span>
            <span className="block text-[2.3rem] text-violet-main sm:text-[5.5rem] lg:text-[7.5rem]">Autrement.</span>
          </h1>

          {/* Floating visual card, echoing a phone/product glimpse */}
          <div className="relative mx-auto mt-8 w-full max-w-[220px] sm:absolute sm:right-0 sm:top-0 sm:mt-0 sm:max-w-[240px] lg:max-w-[280px]">
            <div className="aspect-[4/5] w-full rounded-[1.75rem] bg-gradient-to-br from-violet-main via-violet-dark to-violet-dark shadow-[0_25px_50px_rgba(71,41,92,0.35)]" />
            <div className="absolute -left-6 top-6 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11px] font-bold text-violet-dark shadow-[0_10px_25px_rgba(0,0,0,0.12)] sm:-left-10">
              <span className="h-1.5 w-1.5 rounded-full bg-green-main" />
              Cohorte 2026 ouverte
            </div>
            <div className="absolute -bottom-4 -right-2 rounded-full bg-yellow-orange px-3.5 py-2 text-[11px] font-bold text-violet-dark shadow-[0_10px_25px_rgba(0,0,0,0.12)] sm:-right-6">
              Mentorat 1:1
            </div>
          </div>
        </div>

        {/* Split subtext + CTA, like a caption row under the big type */}
        <div className="mt-14 flex flex-col gap-8 border-t border-black/5 pt-8 sm:flex-row sm:items-start sm:justify-between lg:mt-20">
          <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            <p className="text-sm leading-relaxed text-gray-main">
              Le parcours structuré pour transformer une idée en startup&nbsp;: candidature,
              mentorat et roadmap suivie.
            </p>
            <p className="text-sm leading-relaxed text-gray-main">
              Une Deal Room sécurisée pour convaincre les investisseurs, jusqu&apos;à la levée
              de fonds.
            </p>
          </div>
          <Link
            href="/candidature"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-violet-dark px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(71,41,92,0.25)] transition-all hover:-translate-y-0.5 hover:bg-violet-main"
          >
            Candidater →
          </Link>
        </div>
      </div>
    </div>
  );
}
