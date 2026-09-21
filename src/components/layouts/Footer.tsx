import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LINKS = [
  { href: "/candidature", label: "Candidature" },
  { href: "/vitrine", label: "Vitrine" },
  { href: "/mentors", label: "Mentors" },
  { href: "/out-cubator", label: "Out-Cubator" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 bg-white py-10" data-theme="light">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-8 sm:flex-row sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="IN-CUBATOR" width={110} height={36} className="object-contain" />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-gray-main">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-violet-main">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="mailto:contact@in.cubator" className="text-sm font-semibold text-gray-main transition-colors hover:text-violet-main">
            contact@in.cubator
          </a>
          <span className="text-xs text-gray-main/60">© {new Date().getFullYear()} IN-CUBATOR</span>
        </div>
      </div>
    </footer>
  );
}
