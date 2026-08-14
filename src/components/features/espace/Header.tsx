"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HeaderData {
  userName: string;
  progressPercent: number;
  completedObjectives: number;
  totalObjectives: number;
}

export default function Header({ data }: { data?: HeaderData }) {
  const userName = data?.userName || "Utilisateur";
  const progress = data?.progressPercent || 0;
  const completed = data?.completedObjectives || 0;
  const total = data?.totalObjectives || 0;

  return (
    <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-[#47295C] flex items-center gap-2">
          Bienvenue, {userName} ! <span className="text-xl">👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Voici l&apos;avancement de votre projet aujourd&apos;hui.
        </p>
      </div>

      <div className="flex items-center gap-8 w-full md:w-auto">
        {/* Progress Tracker */}
        <div className="flex-1 md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#47295C]">Progression du projet</span>
            <span className="text-lg font-extrabold text-[#47295C]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-2 bg-gray-100 [&>div]:bg-[#47295C]" />
          <p className="text-[10px] text-gray-400">{completed} / {total} objectifs complétés</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={18} />
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#47295C] text-white flex items-center justify-center font-bold text-lg shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
