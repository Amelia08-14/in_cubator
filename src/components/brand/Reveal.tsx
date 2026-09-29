"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Décalage vertical de départ (px). */
  y?: number;
  delay?: number;
  /** Révèle les enfants directs en cascade au lieu du bloc entier. */
  stagger?: number;
  /** Ne joue pas au scroll mais dès le montage (contenu au-dessus de la ligne de flottaison). */
  immediate?: boolean;
};

/**
 * Entrée au scroll : le contenu reste visible par défaut (SSR, JS coupé,
 * mouvement réduit) et ne s'anime que lorsque GSAP a pris la main.
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 32,
  delay = 0,
  stagger,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        ease: "expo.out",
        stagger: stagger ?? 0,
        clearProps: "transform,opacity",
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, immediate]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
