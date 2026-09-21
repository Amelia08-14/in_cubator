"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useLogout } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  FileText, 
  MonitorPlay,
  Calendar, 
  Users,
  Zap,
  BookOpen, 
  UserCircle,
  AlertCircle,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Target
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useLogout("/admin/connexion");

  const navItems = [
    { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard, badge: null },
    { name: "Candidatures", href: "/admin/candidatures", icon: FileText, badge: null },
    { name: "Cohortes", href: "/admin/cohortes", icon: Calendar, badge: null },
    { name: "Startups", href: "/admin/startups", icon: Target, badge: null },
    { name: "Mentors & Experts", href: "/admin/mentors", icon: Users, badge: null },
    { name: "Open Innovation", href: "/admin/open-innovation", icon: Zap, badge: null },
    { name: "Bibliothèque CMS", href: "/admin/bibliotheque", icon: BookOpen, badge: null },
    { name: "Utilisateurs", href: "/admin/utilisateurs", icon: UserCircle, badge: null }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col hidden lg:flex">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <Image src="/logo.png" alt="IN-CUBATOR" width={140} height={40} className="object-contain" />
      </div>

      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Espace Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        <ul className="space-y-1">
          {navItems.map((item) => {
            // Precise active logic for the root dashboard
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname?.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                    isActive 
                      ? "bg-[#47295C] text-white shadow-sm" 
                      : "text-gray-500 hover:text-[#47295C] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white text-[#47295C]" : "bg-gray-100 text-gray-500"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-2 mt-auto">
        {/* Support Link */}
        <Link href="/admin/support" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#47295C] hover:bg-gray-50 rounded-xl transition-all">
          <HelpCircle size={18} />
          Besoin d'aide ?
        </Link>

        {/* Logout */}
        <button
          onClick={() => void logout()}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

        {/* User Profile */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 shadow-sm bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#47295C] flex items-center justify-center text-white font-bold text-lg shrink-0">
              A
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#47295C]">Admin</h4>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </div>
    </aside>
  );
}
