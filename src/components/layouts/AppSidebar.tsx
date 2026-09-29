"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, LogOut, Menu, X } from "lucide-react";

import { useLogout } from "@/lib/auth-client";

export type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: number | null;
  /** Correspondance exacte (tableau de bord) plutôt que par préfixe. */
  exact?: boolean;
};

export type NavGroup = { title?: string; items: NavItem[] };

/**
 * Barre latérale commune aux espaces connectés (administration, startup, mentor,
 * investisseur) : mêmes codes visuels IN, menu tiroir sur mobile.
 */
export default function AppSidebar({
  groups,
  roleLabel,
  homeHref,
  logoutTo,
  helpHref,
}: {
  groups: NavGroup[];
  roleLabel: string;
  homeHref: string;
  logoutTo: string;
  helpHref?: string;
}) {
  const pathname = usePathname();
  const logout = useLogout(logoutTo);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (value: boolean) => setOpenFor(value ? pathname : null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (item: NavItem) =>
    item.exact || item.href === homeHref ? pathname === item.href : pathname?.startsWith(item.href);

  const content = (
    <>
      <div className="px-6 pb-5 pt-7">
        <Link href={homeHref} aria-label={`IN-CUBATOR — ${roleLabel}`}>
          <Image src="/logo-light.png" alt="IN-CUBATOR" width={170} height={54} className="h-10 w-auto object-contain" />
        </Link>
        <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/55">{roleLabel}</p>
      </div>

      <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 pb-4" aria-label={`Navigation ${roleLabel}`}>
        {groups.map((group, gi) => (
          <div key={group.title ?? gi} className="mt-5 first:mt-1">
            {group.title && (
              <p className="px-3 pb-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/45">{group.title}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center justify-between gap-3 px-3 py-2.5 text-[0.9rem] font-semibold transition-colors ${
                        active ? "bg-violet-dark text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon size={18} strokeWidth={active ? 2.4 : 2} />
                        {item.name}
                      </span>
                      {item.badge ? (
                        <span className="tabular min-w-[1.4rem] bg-orange-accent px-1.5 py-0.5 text-center text-[0.7rem] font-bold text-white">
                          {item.badge}
                        </span>
                      ) : (
                        active && <span className="hex h-2 w-2 bg-orange-accent" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        {helpHref && (
          <Link
            href={helpHref}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/65 transition-colors hover:bg-white/8 hover:text-white"
          >
            <HelpCircle size={18} />
            Besoin d&apos;aide ?
          </Link>
        )}
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium text-white/65 transition-colors hover:bg-orange-accent/20 hover:text-white"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Bureau */}
      <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col bg-violet-deep text-white lg:flex">
        {content}
      </aside>

      {/* Mobile : barre supérieure + tiroir */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-violet-deep px-4 text-white lg:hidden">
        <Link href={homeHref} aria-label={`IN-CUBATOR — ${roleLabel}`}>
          <Image src="/logo-light.png" alt="IN-CUBATOR" width={120} height={38} className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center"
        >
          <Menu size={24} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button type="button" aria-label="Fermer le menu" className="absolute inset-0 bg-violet-ink/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col bg-violet-deep text-white shadow-deep">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center text-white/80"
            >
              <X size={22} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
