"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Info, Loader2 } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: any | null;
  startupId: string;
}

export default function BookingModal({ isOpen, onClose, mentor, startupId }: BookingModalProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedDateStr(null);
      setSelectedSlotId(null);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen || !mentor) return null;

  // Group disponibilites by date string YYYY-MM-DD
  const disponibilitesByDate = mentor.disponibilites?.reduce((acc: any, d: any) => {
    const dateStr = d.dateDebut.split("T")[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(d);
    return acc;
  }, {}) || {};

  const availableDates = Object.keys(disponibilitesByDate).sort();
  const activeDate = selectedDateStr || (availableDates.length > 0 ? availableDates[0] : null);
  const activeSlots = activeDate ? disponibilitesByDate[activeDate] : [];

  const handleBook = async () => {
    if (!selectedSlotId) return;
    setIsBooking(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MENTORAT",
          startupId: startupId,
          mentorId: mentor.id,
          disponibiliteId: selectedSlotId
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error?.message || "Erreur lors de la réservation.");
      } else {
        alert("Réservation confirmée ! Vous recevrez un email prochainement.");
        onClose();
        // Ideally we would refresh the page to remove the slot from the list
        window.location.reload();
      }
    } catch (err) {
      setErrorMsg("Une erreur est survenue.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#47295C]/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#47295C]">Réserver un créneau</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-8">
          
          {/* Mentor Summary */}
          <div className="flex gap-4 items-center mb-10 pb-8 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#47295C]">{mentor.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{mentor.role}</p>
              <div className="flex flex-wrap gap-2">
                {mentor.tags?.map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded border border-[#964594]/30 text-[#47295C] text-[10px] font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {availableDates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Ce mentor n'a aucune disponibilité pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Left Column: Calendar (simplified for MVP just showing available dates) */}
              <div>
                <h4 className="font-bold text-sm text-[#47295C] mb-4">1. Choisissez une date</h4>
                <div className="space-y-2">
                  {availableDates.map(dateStr => {
                    const d = new Date(dateStr);
                    const label = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
                    const isSelected = activeDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          setSelectedDateStr(dateStr);
                          setSelectedSlotId(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all border ${
                          isSelected ? "bg-[#47295C] text-white border-[#47295C] shadow-sm" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Time Slots & Details */}
              <div className="space-y-8">
                
                <div>
                  <h4 className="font-bold text-sm text-[#47295C] mb-4 flex justify-between">
                    2. Choisissez un créneau
                  </h4>
                  <div className="flex flex-col gap-3">
                    {activeSlots.map((slot: any) => {
                      const startTimeStr = new Date(slot.dateDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
                      const endTimeStr = new Date(slot.dateFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`flex items-center justify-between p-3 rounded-lg text-sm font-bold border transition-all ${
                            selectedSlotId === slot.id 
                              ? 'bg-[#47295C] text-white border-[#47295C] shadow-md' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#964594]/50 hover:bg-[#964594]/5'
                          }`}
                        >
                          <span>{startTimeStr} - {endTimeStr}</span>
                          <span className={`text-xs px-2 py-1 rounded-md ${
                            selectedSlotId === slot.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {slot.format === "Visioconférence" ? "Visio" : "Présentiel"}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-2 text-gray-500 max-w-sm">
            <Info size={16} className="shrink-0 mt-0.5 text-[#964594]" />
            <p className="text-[11px] leading-tight">
              Vous recevrez un email de confirmation avec les détails du rendez-vous et le lien de connexion.
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={handleBook}
              disabled={!selectedSlotId || isBooking}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-colors shadow-sm ${
                !selectedSlotId || isBooking ? "bg-gray-300 cursor-not-allowed" : "bg-[#47295C] hover:bg-[#964594]"
              }`}
            >
              {isBooking && <Loader2 size={16} className="animate-spin" />}
              Confirmer la réservation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
