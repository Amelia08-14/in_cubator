"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

import { PROGRAMME_STEPS } from "@/lib/content/programme";

gsap.registerPlugin(ScrollTrigger);

const W = 1200;
const H = 300;
const NODES = PROGRAMME_STEPS.map((_, i) => ({
  x: 100 + i * 200,
  y: i % 2 === 0 ? 92 : 208,
}));

// Courbe en S qui traverse les six stations, comme la ligne orange du catalogue.
const PATH = (() => {
  let d = `M -20 150 C 40 150, 50 ${NODES[0].y}, ${NODES[0].x} ${NODES[0].y}`;
  for (let i = 1; i < NODES.length; i++) {
    const a = NODES[i - 1];
    const b = NODES[i];
    d += ` C ${a.x + 100} ${a.y}, ${b.x - 100} ${b.y}, ${b.x} ${b.y}`;
  }
  const last = NODES[NODES.length - 1];
  d += ` C ${last.x + 60} ${last.y}, ${W - 40} 150, ${W + 20} 150`;
  return d;
})();

const HEX_R = 38;
const HEX = (cx: number, cy: number, r = HEX_R) =>
  [0, 1, 2, 3, 4, 5]
    .map((k) => {
      const a = (Math.PI / 3) * k;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");

export default function Parcours() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const host = section.current;
    const pinEl = stage.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!host || !pinEl || !path || !dot) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const total = path.getTotalLength();
      path.style.strokeDasharray = `${total}`;
      path.style.strokeDashoffset = `${total}`;

      const update = (p: number) => {
        const drawn = p * total;
        path.style.strokeDashoffset = `${total - drawn}`;
        const pt = path.getPointAtLength(Math.max(drawn, 0.01));
        dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        // La station active est la dernière que la ligne a dépassée.
        let idx = 0;
        NODES.forEach((n, i) => {
          if (pt.x >= n.x - 6) idx = i;
        });
        setActive((prev) => (prev === idx ? prev : idx));
      };

      update(0);

      const st = ScrollTrigger.create({
        trigger: host,
        start: "top top+=72",
        end: "+=440%",
        pin: pinEl,
        scrub: 0.6,
        onUpdate: (self) => update(self.progress),
      });

      return () => {
        st.kill();
        path.style.strokeDasharray = "";
        path.style.strokeDashoffset = "";
        setActive(0);
      };
    });

    return () => mm.revert();
  }, []);

  const step = PROGRAMME_STEPS[active];

  return (
    <section id="parcours" aria-labelledby="parcours-titre" className="relative bg-cream">
      {/* Version mobile / mouvement réduit : liste verticale, tout est lisible */}
      <div className="mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-8 lg:hidden motion-reduce:lg:block">
        <h2 id="parcours-titre-mobile" className="max-w-xl font-serif text-4xl font-extrabold leading-[1.08] text-violet-dark">
          Six étapes pour transformer une idée en projet concret.
        </h2>
        <ol className="relative mt-12 space-y-10 before:absolute before:bottom-4 before:left-[1.65rem] before:top-4 before:w-[3px] before:bg-orange-accent/70">
          {PROGRAMME_STEPS.map((s) => (
            <li key={s.n} className="relative pl-[4.5rem]">
              <span
                className="hex absolute left-0 top-0 flex h-[3.3rem] w-[3.3rem] items-center justify-center bg-violet-dark font-serif text-lg font-bold text-white"
                aria-hidden
              >
                {String(s.n).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-xl font-bold leading-snug text-violet-dark">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-gray-main">{s.summary}</p>
            </li>
          ))}
        </ol>
        <Link href="/programme" className="btn btn-violet mt-12">
          Voir le programme en détail <ArrowRight size={18} />
        </Link>
      </div>

      {/* Version bureau : section épinglée, la ligne se dessine au scroll */}
      <div ref={section} className="hidden lg:block motion-reduce:lg:hidden">
        <div ref={stage} className="relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-center overflow-hidden py-10">
          <div className="mx-auto w-full max-w-[1320px] px-8">
            <div className="flex items-end justify-between gap-8">
              <h2 id="parcours-titre" className="max-w-2xl font-serif text-[2.7rem] font-extrabold leading-[1.08] text-violet-dark">
                Six étapes pour transformer une idée en projet concret.
              </h2>
              <p className="max-w-xs pb-2 text-sm leading-relaxed text-gray-main">
                Faites défiler : le parcours d&apos;incubation avance avec vous, de la première
                analyse au lancement.
              </p>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-6 h-auto w-full overflow-visible"
              role="img"
              aria-label="Les six étapes du programme d'incubation"
            >
              <path d={PATH} fill="none" stroke="#dccfba" strokeWidth={5} strokeLinecap="round" />
              <path
                ref={pathRef}
                d={PATH}
                fill="none"
                stroke="#d44835"
                strokeWidth={5}
                strokeLinecap="round"
              />


              <g ref={dotRef}>
                <circle r={11} fill="#d44835" />
                <circle r={4.5} fill="#fff" />
              </g>

              {NODES.map((n, i) => {
                const reached = i <= active;
                const current = i === active;
                const up = i % 2 === 0;
                const s = PROGRAMME_STEPS[i];
                return (
                  <g key={s.n}>
                    {current && (
                      <polygon points={HEX(n.x, n.y, HEX_R + 9)} fill="none" stroke="#d44835" strokeWidth={2.5} />
                    )}
                    <polygon
                      points={HEX(n.x, n.y)}
                      fill={reached ? "#3e2a57" : "#ffffff"}
                      stroke="#3e2a57"
                      strokeWidth={3}
                      style={{ transition: "fill 0.4s" }}
                    />
                    <text
                      x={n.x}
                      y={n.y + 8}
                      textAnchor="middle"
                      fontFamily="var(--font-roboto-slab)"
                      fontWeight={700}
                      fontSize={24}
                      fill={reached ? "#ffffff" : "#3e2a57"}
                      style={{ transition: "fill 0.4s" }}
                    >
                      {String(s.n).padStart(2, "0")}
                    </text>
                    <text
                      x={n.x}
                      y={up ? n.y - HEX_R - 22 : n.y + HEX_R + 34}
                      textAnchor="middle"
                      fontFamily="var(--font-roboto-slab)"
                      fontWeight={current ? 700 : 500}
                      fontSize={20}
                      fill={current ? "#3e2a57" : "#5d5361"}
                    >
                      {s.short}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-6 grid grid-cols-[1.1fr_0.9fr] items-center gap-12">
              <div key={step.n} className="min-h-[230px] animate-[fadeUp_0.6s_var(--ease-out-expo)_both]">
                <p className="font-serif text-sm font-bold text-orange-deep">
                  Étape {String(step.n).padStart(2, "0")} sur 06
                </p>
                <h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-violet-dark">{step.title}</h3>
                <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-gray-main">{step.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-violet-dark">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="hex h-2.5 w-2.5 bg-orange-accent" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="facet-tr relative aspect-[16/9] w-full overflow-hidden bg-sand shadow-lift">
                  {PROGRAMME_STEPS.map((s, i) => (
                    <Image
                      key={s.n}
                      src={s.photo}
                      alt={i === active ? s.photoAlt : ""}
                      aria-hidden={i !== active}
                      fill
                      sizes="40vw"
                      className={`object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
