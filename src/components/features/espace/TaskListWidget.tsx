"use client";

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  assigneeName: string;
  assigneeImage: string;
  status: "À faire" | "En cours" | "En revue" | "Terminé";
  statusColor: string;
}

const mockTasks: Task[] = [];

export default function TaskListWidget() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
        </svg>
        <h2 className="text-lg font-bold text-[#47295C]">B. Tâches (assignables)</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 mb-3 px-2">
          <div className="col-span-6 text-xs font-bold text-gray-500">Tâche</div>
          <div className="col-span-3 text-xs font-bold text-gray-500">Assigné à</div>
          <div className="col-span-3 text-xs font-bold text-gray-500 text-right pr-2">Statut</div>
        </div>

        <div className="space-y-1">
          {tasks.map(task => (
            <div key={task.id} className="grid grid-cols-12 gap-4 items-center py-2.5 px-2 hover:bg-gray-50 rounded-lg transition-colors group">
              <div className="col-span-6 flex items-center gap-3">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                    task.isCompleted ? 'bg-[#964594] border-[#964594] text-white' : 'border-gray-300 bg-white hover:border-[#964594]'
                  }`}
                >
                  {task.isCompleted && <Check size={12} strokeWidth={3} />}
                </button>
                <span className={`text-sm font-medium truncate ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.title}
                </span>
              </div>
              
              <div className="col-span-3">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition-all w-full text-left">
                  <img src={task.assigneeImage} alt={task.assigneeName} className="w-6 h-6 rounded-full bg-gray-200 shrink-0 object-cover" />
                  <span className="text-xs font-medium text-gray-600 truncate flex-1">{task.assigneeName}</span>
                  <ChevronDown size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </div>

              <div className="col-span-3 flex justify-end">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${task.statusColor}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="text-xs font-bold text-[#964594] hover:text-[#47295C] transition-colors flex items-center gap-1 group">
          Voir toutes les tâches
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
