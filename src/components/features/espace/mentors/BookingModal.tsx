"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Mentor } from "@/lib/data/mentors";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
}

export default function BookingModal({ isOpen, onClose, mentor }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(17); // Default to 17 as per mockup
  const [selectedSlot, setSelectedSlot] = useState<string | null>("10:30"); // Default as per mockup

  if (!isOpen || !mentor) return null;

  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

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
                {mentor.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded border border-[#964594]/30 text-[#47295C] text-[10px] font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Column: Calendar */}
            <div>
              <h4 className="font-bold text-sm text-[#47295C] mb-4">1. Choisissez une date</h4>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft size={16}/></button>
                  <span className="font-bold text-sm text-[#47295C]">Juin 2026</span>
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight size={16}/></button>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-xs">
                  {/* Days */}
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="text-gray-400 font-bold mb-2">{day}</div>
                  ))}
                  
                  {/* Dates */}
                  {dates.map(date => {
                    const isSelected = date === selectedDate;
                    // Mocking some dots for availability
                    const hasAvailability = date % 3 === 0 || date === 17 || date === 24; 
                    
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`relative w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                          isSelected 
                            ? 'bg-[#47295C] text-white font-bold shadow-md' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {date}
                        {hasAvailability && !isSelected && (
                          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#964594]"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Time Slots & Details */}
            <div className="space-y-8">
              
              <div>
                <h4 className="font-bold text-sm text-[#47295C] mb-4 flex justify-between">
                  2. Choisissez un créneau
                  <span className="text-xs font-normal text-gray-400">Heure locale (GMT+1)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedSlot(time)}
                      className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${
                        selectedSlot === time 
                          ? 'bg-[#47295C] text-white border-[#47295C] shadow-md' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#964594]/50 hover:bg-[#964594]/5'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#47295C] mb-3">3. Durée de la session</h4>
                <select className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:border-[#964594]">
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#47295C] mb-3">4. Objet de l'échange (optionnel)</h4>
                <textarea 
                  rows={3} 
                  placeholder="Décrivez brièvement le sujet que vous souhaitez aborder..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:border-[#964594]"
                ></textarea>
              </div>

            </div>
          </div>
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
              onClick={() => {
                alert("Réservation confirmée !");
                onClose();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#47295C] text-white font-bold text-sm hover:bg-[#964594] transition-colors shadow-sm"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
