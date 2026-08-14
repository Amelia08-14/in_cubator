"use client";

import React from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar: string;
  avatarImage?: boolean;
  role: string;
  roleColor: string;
  date: string;
  time: string;
  status: string;
  statusColor: string;
  statusDot: string;
  isPending?: boolean;
  isInactive?: boolean;
}

export default function AdminUsersTable({ users = [] }: { users?: UserData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[35%]">Utilisateur</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[20%] text-center">Rôle</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%]">Date de création ↓</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%] text-center">Statut</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-500 w-[15%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {user.avatarImage ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
                        <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#f1edfa] text-[#47295C] flex items-center justify-center text-xs font-bold shrink-0">
                        {user.avatar}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold ${user.roleColor}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs text-gray-900">{user.date}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{user.time}</p>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="inline-flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.statusDot}`}></span>
                    <span className={`text-[11px] font-bold ${user.statusColor}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end">
                    <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-md transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
        <p className="text-[11px] text-gray-500">
          Affichage de {users.length > 0 ? 1 : 0} à {users.length} sur {users.length} utilisateurs
        </p>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors" disabled>
            <ChevronLeft size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3719CA] text-white font-bold text-xs shadow-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors" disabled>
            <ChevronRight size={14} />
          </button>
          <select className="ml-2 pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none cursor-pointer appearance-none">
            <option>10 / page</option>
            <option>20 / page</option>
            <option>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
