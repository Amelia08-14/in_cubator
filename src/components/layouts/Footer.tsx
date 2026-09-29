import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

const PROGRAMME = [
  { href: "/programme", label: "Le parcours d'incubation" },
  { href: "/candidature", label: "Candidater" },
  { href: "/startups", label: "Startups accompagnées" },
  { href: "/mentors", label: "Mentors & experts" },
  { href: "/evenements", label: "Évènements" },
];

const ECOSYSTEME = [
  { href: "/out-cubator", label: "Out-Cubator — entreprendre depuis l'étranger" },
  { href: "/connexion", label: "Espace startup" },
  { href: "/espace-investisseur", label: "Espace investisseur" },
  { href: "/espace-mentor", label: "Espace mentor" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-paper-deep text-violet-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-96 bg-sand/60"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 px-5 pb-10 pt-20 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="IN-CUBATOR — accueil">
            <Image src="/logo.png" alt="IN-CUBATOR" width={190} height={60} className="h-12 w-auto" />
          </Link>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-gray-main">
            L&apos;incubateur de La Maison IN Groupe. Un programme, des experts et un réseau pour
            transformer les idées en projets concrets.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold">Le programme</h2>
          <ul className="mt-5 space-y-3 text-[0.92rem] text-gray-main">
            {PROGRAMME.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-violet-dark hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold">L&apos;écosystème</h2>
          <ul className="mt-5 space-y-3 text-[0.92rem] text-gray-main">
            {ECOSYSTEME.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-violet-dark hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold">Nous trouver</h2>
          <ul className="mt-5 space-y-3.5 text-[0.92rem] text-gray-main">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-orange-deep" />
              Hydra, Alger — à deux pas des banques, de l&apos;APC et des impôts
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-orange-deep" />
              <span className="tabular">05 60 06 74 86 / 020 071 051</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-orange-deep" />
              <a href="mailto:contact@in-network.dz" className="transition-colors hover:text-violet-dark hover:underline hover:underline-offset-4">
                contact@in-network.dz
              </a>
            </li>
            <li>
              <a
                href="https://www.in-network.dz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-violet-dark transition-colors hover:text-orange-deep"
              >
                Découvrir IN NETWORK <ArrowUpRight size={16} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-sand">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-2 px-5 py-6 text-xs text-gray-main sm:flex-row sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} IN-CUBATOR — La Maison IN Groupe</span>
          <span>Fait à Alger</span>
        </div>
      </div>
    </footer>
  );
}
