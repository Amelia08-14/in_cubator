"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: to,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(state.v));
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to]);

  return (
    <span ref={ref} className="tabular">
      {to}
    </span>
  );
}

export default function NetworkBand() {
  return (
    <section aria-label="La communauté IN" className="relative overflow-hidden bg-orange-accent text-white">
      <div
        aria-hidden
        className="absolute -left-10 top-0 h-full w-40 bg-orange-deep/60"
        style={{ clipPath: "polygon(0 0, 70% 0, 100% 100%, 0 100%)" }}
      />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <p className="max-w-4xl font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[3.1rem]">
          +<Counter to={250} /> entreprises et +<Counter to={20} /> startups nous ont déjà fait confiance.
        </p>
        <p className="max-w-sm text-lg leading-relaxed text-white">
          IN NETWORK déploie son réseau à l&apos;échelle nationale, avec des espaces pensés pour
          le travail collaboratif et l&apos;accompagnement des startups.
        </p>
      </div>
    </section>
  );
}
