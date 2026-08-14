import React from "react";
import { Calendar as CalendarIcon, Trash2, ArrowRight, Users } from "lucide-react";

export interface Slot {
  id: string;
  dateStr: string; // ISO format YYYY-MM-DD
  startTime: string;
  endTime: string;
  format: "Visioconférence" | "En présentiel";
  type: "Individuel" | "Groupe";
  capacity?: number;
}

interface ActiveSlotsListProps {
  slots: Slot[];
  onDeleteSlot: (id: string) => void;
}

export default function ActiveSlotsList({ slots, onDeleteSlot }: ActiveSlotsListProps) {
  // Format date for grouping headers
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.dateStr]) {
      acc[slot.dateStr] = [];
    }
    acc[slot.dateStr].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Mes créneaux ouverts</h2>
        <p className="text-[11px] text-gray-500 font-medium">Gérez vos disponibilités actives.</p>
      </div>

      <div className="flex-1 overflow-auto pr-2 space-y-6">
        {sortedDates.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Aucun créneau ouvert pour le moment.
          </div>
        ) : (
          sortedDates.map((dateStr) => (
            <div key={dateStr} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon size={16} className="text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">{formatDateHeader(dateStr)}</h3>
              </div>
              
              <div className="space-y-2">
                {groupedSlots[dateStr].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-xs font-semibold text-gray-700">{slot.startTime} - {slot.endTime}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          slot.format === "Visioconférence" 
                            ? "bg-[#f1edfa] text-[#47295C]" 
                            : "bg-orange-50 text-orange-600"
                        }`}>
                          {slot.format}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                          slot.type === "Groupe" 
                            ? "bg-blue-50 text-blue-600" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {slot.type === "Groupe" && <Users size={10} />}
                          {slot.type} {slot.type === "Groupe" && slot.capacity ? `(${slot.capacity})` : ""}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteSlot(slot.id)}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#47295C] text-[#47295C] rounded-lg text-xs font-bold hover:bg-purple-50 transition-colors">
          Voir toutes les disponibilités
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
