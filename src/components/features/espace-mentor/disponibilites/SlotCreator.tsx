import React, { useState } from "react";
import { Clock, Video, MapPin, Info, ChevronDown, User, Users } from "lucide-react";

interface SlotCreatorProps {
  selectedDate: Date;
  onAddSlot: (slot: { startTime: string; endTime: string; format: "Visioconférence" | "En présentiel"; type: "Individuel" | "Groupe"; capacity?: number }) => void;
}

export default function SlotCreator({ selectedDate, onAddSlot }: SlotCreatorProps) {
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [format, setFormat] = useState<"Visioconférence" | "En présentiel">("Visioconférence");
  const [type, setType] = useState<"Individuel" | "Groupe">("Individuel");
  const [capacity, setCapacity] = useState<number>(5);

  // Format date for display: e.g., Jeudi 13 Août 2026
  const formatDate = (date: Date) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${dayNum} ${monthName} ${year}`;
  };

  const handleAdd = () => {
    onAddSlot({ startTime, endTime, format, type, capacity: type === "Groupe" ? capacity : undefined });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Ajouter une disponibilité</h2>
        <p className="text-sm font-semibold text-[#47295C]">{formatDate(selectedDate)}</p>
      </div>

      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type de session</label>
          <div className="flex gap-3 mb-4">
            {/* Individuel */}
            <div 
              onClick={() => setType("Individuel")}
              className={`flex-1 flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                type === "Individuel" 
                  ? "border-[#47295C] bg-[#f8f5ff] text-[#47295C]" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="text-sm font-semibold">Individuel</span>
              </div>
            </div>

            {/* Groupe */}
            <div 
              onClick={() => setType("Groupe")}
              className={`flex-1 flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                type === "Groupe" 
                  ? "border-[#47295C] bg-[#f8f5ff] text-[#47295C]" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm font-semibold">Groupe</span>
              </div>
            </div>
          </div>
          
          {type === "Groupe" && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Nombre de participants (max 20)</label>
              <input 
                type="number" 
                min={2}
                max={20}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 5)}
                className="block w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Début</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <select 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
              >
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <select 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#47295C]/20 focus:border-[#47295C] transition-all"
              >
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
          <div className="flex gap-3">
            {/* Visioconférence */}
            <div 
              onClick={() => setFormat("Visioconférence")}
              className={`flex-1 flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                format === "Visioconférence" 
                  ? "border-[#47295C] bg-[#f8f5ff] text-[#47295C]" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Video size={16} />
                <span className="text-xs font-semibold">Visio</span>
              </div>
            </div>

            {/* En présentiel */}
            <div 
              onClick={() => setFormat("En présentiel")}
              className={`flex-1 flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                format === "En présentiel" 
                  ? "border-[#47295C] bg-[#f8f5ff] text-[#47295C]" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-xs font-semibold">Présentiel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <button 
          onClick={handleAdd}
          className="w-full py-3 bg-[#47295C] hover:bg-[#5a3875] text-white rounded-lg text-sm font-bold transition-colors shadow-md"
        >
          Ajouter cette disponibilité
        </button>
        
        <div className="flex items-start gap-3 bg-[#f8f5ff] p-4 rounded-lg">
          <Info size={16} className="text-[#47295C] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#47295C] font-medium leading-relaxed">
            Les créneaux seront visibles par les startups et pourront être réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
