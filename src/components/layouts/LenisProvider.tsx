"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Garde ScrollTrigger synchronisé avec le défilement lissé de Lenis.
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}

// Le défilement lissé sert le site public. Les interfaces de travail
// (admin, espaces startup / mentor / investisseur) gardent le scroll natif :
// tableaux, kanban et panneaux latéraux y défilent en interne.
const APP_ROUTES = /^\/(admin|espace)(\/|$|-)/;

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (APP_ROUTES.test(pathname)) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
