"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useCurrentUser, useLogout } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/auth-contract";

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderDark, setIsHeaderDark] = useState(false);
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logout = useLogout("/");
  const dashboard = user ? ROLE_DASHBOARD[user.role] ?? "/" : "/connexion";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Check header theme based on data-theme attribute
      const sections = document.querySelectorAll('[data-theme]');
      
      // If we are on a subpage (not landing), default to light theme (white header) 
      // unless there are explicit dark sections.
      let currentTheme = pathname === '/' ? 'dark' : 'light'; 
      
      if (sections.length > 0) {
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          // Check if the top of the section is above the middle of the header (approx 40px)
          // and the bottom of the section is below the middle of the header
          if (rect.top <= 40 && rect.bottom >= 40) {
            currentTheme = section.getAttribute('data-theme') || 'dark';
          }
        });
      }
      setIsHeaderDark(currentTheme === 'light');
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center transition-all duration-500 ${isHeaderDark ? 'bg-white border-b border-gray-200 shadow-sm' : `bg-violet-dark/90 backdrop-blur-md border-b ${isScrolled ? 'border-white/10' : 'border-transparent'}`}`}>
      <Link href="/" className="flex items-center">
        <Image 
          src="/logo.png" 
          alt="INCubator Logo" 
          width={120} 
          height={40} 
          className={`object-contain transition-all duration-500 ${!isHeaderDark ? 'brightness-0 invert' : ''}`}
          priority
        />
      </Link>
      <nav className={`hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isHeaderDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <Link 
          href="/candidature" 
          className={`transition-colors cursor-pointer hover:text-[#964594] ${pathname === '/candidature' ? 'text-[#964594]' : ''}`}
        >
          Candidature
        </Link>
        <span className="text-[#964594]/50">•</span>
        <Link 
          href="/vitrine" 
          className={`transition-colors cursor-pointer hover:text-[#964594] ${pathname === '/vitrine' ? 'text-[#964594]' : ''}`}
        >
          Vitrine
        </Link>
        <span className="text-[#964594]/50">•</span>
        <Link 
          href="/mentors" 
          className={`transition-colors cursor-pointer hover:text-[#964594] ${pathname === '/mentors' ? 'text-[#964594]' : ''}`}
        >
          Mentors
        </Link>
        <span className="text-[#964594]/50">•</span>
        <Link 
          href="/out-cubator" 
          className={`transition-colors cursor-pointer hover:text-[#964594] ${pathname === '/out-cubator' ? 'text-[#964594]' : ''}`}
        >
          Out-cubator
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button 
              onClick={() => void logout()}
              className={`px-4 py-2.5 rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-500 hover:bg-gray-100 ${
                isHeaderDark 
                  ? 'text-gray-500' 
                  : 'text-white/80 hover:text-[#47295C]'
              }`}
            >
              DÉCONNEXION
            </button>
            <Link 
              href={dashboard}
              className={`px-6 py-2.5 rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-500 border hover:bg-[#964594] hover:text-white hover:border-[#964594] bg-[#964594] text-white border-[#964594] shadow-sm`}
            >
              MON ESPACE
            </Link>
          </>
        ) : (
          <Link 
            href="/connexion" 
            className={`px-6 py-2.5 rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-500 border hover:bg-[#964594] hover:text-white hover:border-[#964594] ${
              isHeaderDark 
                ? 'border-gray-300 text-[#47295C]' 
                : 'border-white/50 text-white'
            }`}
          >
            CONNEXION
          </Link>
        )}
      </div>
    </header>
  );
}
