"use client";

import React, { useState } from "react";
import { Bell, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import AvailabilityCalendar from "@/components/features/espace-mentor/disponibilites/AvailabilityCalendar";
import SlotCreator from "@/components/features/espace-mentor/disponibilites/SlotCreator";
import ActiveSlotsList, { Slot } from "@/components/features/espace-mentor/disponibilites/ActiveSlotsList";

export default function DisponibilitesClient({ initialSlots, mentorInitials }: { initialSlots: Slot[], mentorInitials: string }) {
  const router = useRouter();
  
  // Set default selected date to today, ignoring time part
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive available dates (the dots on calendar)
  const availableDates = Array.from(new Set(slots.map(s => s.dateStr)));

  const handleAddSlot = async (newSlotData: Omit<Slot, "id" | "dateStr">) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Local date mapping
      const dateStr = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
        .toISOString().split('T')[0];

      const payload = {
        dateStr,
        ...newSlotData
      };

      const res = await fetch("/api/mentors/me/disponibilites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        // The API returns the raw Prisma object. We rely on router.refresh() to reload the page state.
        // For instant feedback, we can optimistically add it, or just await refresh.
        router.refresh();
      } else {
        alert("Erreur lors de l'ajout du créneau");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du créneau");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/mentors/me/disponibilites/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Erreur lors de la suppression du créneau");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du créneau");
    } finally {
      setIsProcessing(false);
    }
  };

  // Sync state when props change (router.refresh)
  React.useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#47295C] mb-1">
            Mes Disponibilités
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos créneaux et aidez les startups à réserver du temps avec vous.</p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="relative p-2 text-gray-500 hover:text-[#47295C] transition-colors rounded-full hover:bg-purple-50">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#47295C] rounded-full ring-2 ring-white"></span>
          </button>
          
          <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-sm border border-[#eaddf7]">
              {mentorInitials}
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <AvailabilityCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate}
                availableDates={availableDates}
              />
            </div>
            <div className="lg:col-span-1 opacity-100 transition-opacity" style={{ opacity: isProcessing ? 0.6 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
              <SlotCreator 
                selectedDate={selectedDate} 
                onAddSlot={handleAddSlot} 
              />
            </div>
            <div className="lg:col-span-1 opacity-100 transition-opacity" style={{ opacity: isProcessing ? 0.6 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
              <ActiveSlotsList 
                slots={slots.filter(s => s.dateStr === new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0])}
                onDeleteSlot={handleDeleteSlot}
              />
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="bg-[#f8f5ff] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border border-[#eaddf7] relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#eaddf7] flex items-center justify-center shrink-0">
                <CalendarIcon size={20} className="text-[#47295C]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Conseil</h3>
                <p className="text-gray-600 text-xs">
                  Gardez votre calendrier à jour pour maximiser vos opportunités de mentorat.<br/>
                  Plus vous êtes disponible, plus vous accompagnez de startups !
                </p>
              </div>
            </div>

            {/* Decorative background illustrations */}
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
              <div className="w-32 h-32 bg-[#47295C] rounded-full blur-3xl -mr-10 -mb-10"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
