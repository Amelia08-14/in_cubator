"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Search, Heart, FolderOpen, PieChart, HelpCircle, LogOut, Settings } from "lucide-react";

export default function InvestorSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Explorer", href: "/espace-investisseur", icon: Search, badge: null },
    { name: "Ma Watchlist", href: "/espace-investisseur/watchlist", icon: Heart, badge: 8 },
    { name: "Deal Room", href: "/espace-investisseur/deal-room", icon: FolderOpen, badge: null },
    { name: "Portefeuille", href: "/espace-investisseur/portefeuille", icon: PieChart, badge: null },
    { name: "Préférences", href: "/espace-investisseur/preferences", icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <Image src="/logo.png" alt="IN-CUBATOR" width={140} height={40} className="object-contain" />
      </div>

      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Espace Investisseur</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-[#47295C] text-white shadow-sm" 
                  : "text-gray-500 hover:text-[#47295C] hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white text-[#47295C]" : "bg-gray-100 text-gray-500"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        {/* Support Link */}
        <Link href="/espace-investisseur/support" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#47295C] hover:bg-gray-50 rounded-xl transition-all">
          <HelpCircle size={18} />
          Besoin d'aide ?
        </Link>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/connexion" })}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
