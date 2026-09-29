import Image from "next/image";
import Link from "next/link";

import CubeMark from "@/components/brand/CubeMark";

/**
 * Habillage des pages d'authentification : à gauche, la promesse du programme
 * sur fond violet avec une vraie photo du lieu ; à droite, le formulaire.
 */
export default function AuthShell({
  title,
  subtitle,
  side,
  children,
  photo = "/photos/reception.webp",
  photoAlt = "L'équipe accueille un porteur de projet à l'accueil d'IN NETWORK",
}: {
  title: string;
  subtitle: string;
  side: { heading: string; text: string };
  children: React.ReactNode;
  photo?: string;
  photoAlt?: string;
}) {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative isolate hidden overflow-hidden bg-paper-deep text-violet-dark lg:block">
        <div
          aria-hidden
          className="absolute -right-24 top-0 -z-10 h-full w-72 bg-sand/60"
          style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div className="flex h-full flex-col justify-between px-12 pb-12 pt-32 xl:px-16">
          <div>
            <h2 className="max-w-md font-serif text-4xl font-extrabold leading-[1.1] xl:text-[2.8rem]">{side.heading}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-main">{side.text}</p>
          </div>
          <div className="relative mt-10">
            <div className="facet-photo relative aspect-[4/3] w-full max-w-md overflow-hidden bg-sand shadow-deep">
              <Image src={photo} alt={photoAlt} fill sizes="34vw" className="object-cover" />
            </div>
            <CubeMark decorative className="animate-drift absolute -right-2 -top-14 h-28 w-28 xl:-right-6" />
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 pb-16 pt-32 sm:px-8 lg:pt-28">
        <div className="w-full max-w-[460px]">
          <h1 className="font-serif text-[2rem] font-extrabold leading-tight text-violet-dark sm:text-[2.4rem]">{title}</h1>
          <p className="mt-2 text-gray-main">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-10 text-sm text-gray-main">
            <Link href="/" className="font-bold text-violet-dark underline-offset-4 hover:underline">
              ← Retour au site
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
