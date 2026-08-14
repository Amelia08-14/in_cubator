import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AvailabilityCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  availableDates: string[]; // array of ISO date strings 'YYYY-MM-DD'
}

export default function AvailabilityCalendar({ selectedDate, onSelectDate, availableDates }: AvailabilityCalendarProps) {
  // Simple mock calendar logic for Août 2026 to match design
  const daysOfWeek = ["LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM.", "DIM."];
  
  // Generating August 2026 days specifically for the mock
  // August 2026 starts on a Saturday (index 5)
  // Let's just generate a simple grid that looks like the screenshot
  const calendarDays = [
    { day: 27, isPrevMonth: true }, { day: 28, isPrevMonth: true }, { day: 29, isPrevMonth: true }, { day: 30, isPrevMonth: true }, { day: 31, isPrevMonth: true }, { day: 1, isPrevMonth: false }, { day: 2, isPrevMonth: false },
    { day: 3, isPrevMonth: false }, { day: 4, isPrevMonth: false }, { day: 5, isPrevMonth: false }, { day: 6, isPrevMonth: false }, { day: 7, isPrevMonth: false }, { day: 8, isPrevMonth: false }, { day: 9, isPrevMonth: false },
    { day: 10, isPrevMonth: false }, { day: 11, isPrevMonth: false }, { day: 12, isPrevMonth: false }, { day: 13, isPrevMonth: false }, { day: 14, isPrevMonth: false }, { day: 15, isPrevMonth: false }, { day: 16, isPrevMonth: false },
    { day: 17, isPrevMonth: false }, { day: 18, isPrevMonth: false }, { day: 19, isPrevMonth: false }, { day: 20, isPrevMonth: false }, { day: 21, isPrevMonth: false }, { day: 22, isPrevMonth: false }, { day: 23, isPrevMonth: false },
    { day: 24, isPrevMonth: false }, { day: 25, isPrevMonth: false }, { day: 26, isPrevMonth: false }, { day: 27, isPrevMonth: false }, { day: 28, isPrevMonth: false }, { day: 29, isPrevMonth: false }, { day: 30, isPrevMonth: false },
    { day: 31, isPrevMonth: false }, { day: 1, isNextMonth: true }, { day: 2, isNextMonth: true }, { day: 3, isNextMonth: true }, { day: 4, isNextMonth: true }, { day: 5, isNextMonth: true }, { day: 6, isNextMonth: true },
  ];

  const getFullDateString = (day: number, isPrev: boolean, isNext: boolean) => {
    let month = 8; // August (0-indexed 7, but for string we use 08)
    if (isPrev) month = 7;
    if (isNext) month = 9;
    return `2026-0${month}-${day.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-gray-900">Août 2026</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="text-gray-900 hover:text-gray-900 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="text-xs font-bold text-[#47295C] border border-[#eaddf7] px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
            Aujourd'hui
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 flex-1">
        {calendarDays.map((cell, idx) => {
          const dateStr = getFullDateString(cell.day, !!cell.isPrevMonth, !!cell.isNextMonth);
          
          // Using strict comparison for the mock since selectedDate might just be a matching day number for simplicity, 
          // but we should match by full string. Let's assume selectedDate is passed properly.
          // For the mock, we'll just check if the selectedDate matches this cell's date.
          const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
          const isCurrentMonth = !cell.isPrevMonth && !cell.isNextMonth;
          const hasAvailability = availableDates.includes(dateStr);

          return (
            <div key={idx} className="flex flex-col items-center justify-start h-12">
              <button
                onClick={() => isCurrentMonth && onSelectDate(new Date(dateStr))}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isSelected
                    ? "bg-[#47295C] text-white shadow-md"
                    : isCurrentMonth
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 cursor-default"
                }`}
              >
                {cell.day}
              </button>
              {hasAvailability && isCurrentMonth && !isSelected && (
                <div className="w-1.5 h-1.5 bg-[#47295C] rounded-full mt-1" />
              )}
              {hasAvailability && isSelected && (
                <div className="w-1.5 h-1.5 bg-white/70 rounded-full mt-1 absolute translate-y-7" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#47295C] rounded-full" />
          <span className="text-[10px] font-semibold text-gray-500">Jours avec disponibilités</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#f1edfa] rounded-full" />
          <span className="text-[10px] font-semibold text-gray-500">Jour sélectionné</span>
        </div>
      </div>
    </div>
  );
}
