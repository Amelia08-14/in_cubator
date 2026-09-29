"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Le cube ouvert du logo IN-CUBATOR : six flèches (bleu, violet, orange) qui
 * s'assemblent. À l'arrivée, elles convergent depuis l'extérieur ; ensuite
 * elles respirent doucement. Sans mouvement si l'utilisateur le refuse.
 */
const ARROWS = [
  { x: 100, y: 34, r: 0, c: "#1f5aa6" },
  { x: 152, y: 66, r: 60, c: "#1f5aa6" },
  { x: 48, y: 66, r: -60, c: "#964594" },
  { x: 100, y: 100, r: 180, c: "#964594" },
  { x: 48, y: 134, r: -120, c: "#d44835" },
  { x: 100, y: 166, r: 180, c: "#d44835" },
] as const;

export default function CubeMark({
  className,
  title = "Cube IN-CUBATOR",
  decorative = false,
  autoplay = true,
}: {
  className?: string;
  title?: string;
  decorative?: boolean;
  autoplay?: boolean;
}) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg || !autoplay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const arrows = gsap.utils.toArray<SVGGElement>("[data-arrow]", svg);

      arrows.forEach((el, i) => {
        const a = ARROWS[i];
        const dx = (a.x - 100) * 1.1;
        const dy = (a.y - 100) * 1.1;
        gsap.fromTo(
          el,
          { x: dx, y: dy, opacity: 0, rotate: 0, transformOrigin: "50% 50%" },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 1.4,
            delay: 0.15 + i * 0.09,
            ease: "expo.out",
          },
        );
        gsap.to(el, {
          y: i % 2 === 0 ? -3 : 3,
          duration: 2.6 + i * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.6,
        });
      });
    }, svg);

    return () => ctx.revert();
  }, [autoplay]);

  return (
    <svg
      ref={root}
      viewBox="0 0 200 200"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      fill="none"
    >
      {ARROWS.map((a, i) => (
        <g key={i} data-arrow>
          <g transform={`translate(${a.x} ${a.y}) rotate(${a.r})`}>
            <g stroke={a.c} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
              <path d="M-17 -6 L0 -20 L17 -6" />
              <path d="M0 -20 L0 12" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
