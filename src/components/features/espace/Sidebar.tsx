"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderOpen, BookOpen, LogOut } from "lucide-react";

import { useLogout } from "@/lib/auth-client";

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout("/connexion");

  const navItems = [
    { name: "Tableau de bord", href: "/espace", icon: LayoutDashboard },
    { name: "Mentors", href: "/espace/mentors", icon: Users },
    { name: "Deal Room", href: "/espace/deal-room", icon: FolderOpen },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <Image src="/logo.png" alt="IN-CUBATOR" width={140} height={40} className="object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-[#47295C] text-white shadow-sm" 
                  : "text-gray-500 hover:text-[#47295C] hover:bg-gray-50"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        {/* Logout */}
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 shadow-sm bg-gray-50">
          <div className="w-10 h-10 rounded-lg bg-[#47295C] text-white flex items-center justify-center font-bold text-lg">
            S
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#47295C] text-sm truncate">Startup</h4>
            <p className="text-xs text-gray-500">Porteur de projet</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
