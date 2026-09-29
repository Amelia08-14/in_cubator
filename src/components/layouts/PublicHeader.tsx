"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { useCurrentUser, useLogout } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/auth-contract";

const NAV = [
  { href: "/programme", label: "Le programme" },
  { href: "/startups", label: "Startups" },
  { href: "/mentors", label: "Mentors" },
  { href: "/evenements", label: "Évènements" },
  { href: "/out-cubator", label: "Out-Cubator" },
];

export default function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const { data: user } = useCurrentUser();
  const logout = useLogout("/");
  const dashboard = user ? ROLE_DASHBOARD[user.role] ?? "/" : "/connexion";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        scrolled || open
          ? "border-b border-sand/70 bg-paper/92 shadow-[0_10px_30px_-18px_rgb(74_52_40/0.45)] backdrop-blur-md"
          : "border-b border-transparent bg-paper"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="IN-CUBATOR — accueil">
          <Image
            src="/logo.png"
            alt="IN-CUBATOR"
            width={150}
            height={47}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-4 py-2 text-[0.92rem] font-semibold transition-colors ${
                  active ? "text-violet-dark" : "text-gray-main hover:text-violet-dark"
                } after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-orange-accent after:transition-transform after:duration-300 ${
                  active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <button
                onClick={() => void logout()}
                className="px-3 py-2 text-sm font-semibold text-gray-main transition-colors hover:text-violet-dark"
              >
                Déconnexion
              </button>
              <Link href={dashboard} className="btn btn-primary !py-3">
                Mon espace
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="px-3 py-2 text-sm font-semibold text-violet-dark transition-colors hover:text-orange-deep"
              >
                Connexion
              </Link>
              <Link href="/candidature" className="btn btn-primary !py-3">
                Candidater
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-violet-dark lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpenFor(open ? null : pathname)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-paper px-5 pb-10 pt-6 lg:hidden">
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-sand py-4 font-serif text-2xl font-bold text-violet-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/candidature" className="btn btn-primary">
              Candidater au programme
            </Link>
            {user ? (
              <>
                <Link href={dashboard} className="btn btn-ghost-dark">
                  Mon espace
                </Link>
                <button onClick={() => void logout()} className="btn btn-ghost-dark">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/connexion" className="btn btn-ghost-dark">
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
