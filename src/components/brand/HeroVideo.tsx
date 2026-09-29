"use client";

import { useEffect, useRef } from "react";

/**
 * Vidéo du héros : lue une seule fois puis figée sur son image finale (la
 * composition complète), sans son ni boucle. Sous `prefers-reduced-motion`, elle
 * n'est pas lue : on affiche directement l'image finale.
 *
 * La vidéo est encodée sur fond blanc. `mix-blend-mode: multiply` (à appliquer
 * via `className`) fait disparaître ce blanc dans le fond beige de la section :
 * aucun cadre, aucune carte autour de la composition. Aucun ancêtre entre la
 * vidéo et la section ne doit porter d'opacité, de transformation ou de filtre,
 * sinon le mélange s'isole et le blanc réapparaît.
 */
export default function HeroVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showFinalFrame = () => {
        video.currentTime = Math.max(video.duration - 0.05, 0);
      };
      if (video.readyState >= 1) showFinalFrame();
      else video.addEventListener("loadedmetadata", showFinalFrame, { once: true });
      return () => video.removeEventListener("loadedmetadata", showFinalFrame);
    }

    // Les navigateurs peuvent refuser la lecture automatique : l'image d'attente reste alors affichée.
    video.play().catch(() => undefined);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      role="img"
      aria-label={label}
    />
  );
}
