"use client";

import Link from "next/link";
import { CalendarClock, Star } from "lucide-react";

import {
  SOURCE_LABEL,
  TYPE_LABEL,
  formatDate,
  staffInitial,
  staffName,
  urgencyOf,
  type Lead,
} from "@/lib/crm/types";

const URGENCY_STYLE = {
  overdue: "bg-orange-accent/12 text-orange-deep",
  today: "bg-yellow-orange/25 text-[#7a5200]",
  soon: "bg-paper-deep text-gray-main",
  none: "",
} as const;

export function PriorityStars({
  value,
  onChange,
  size = 14,
}: {
  value: number;
  onChange?: (next: number) => void;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center" role={onChange ? "group" : "img"} aria-label={`Priorité ${value} sur 3`}>
      {[1, 2, 3].map((n) => {
        const on = n <= value;
        const star = (
          <Star
            size={size}
            className={on ? "fill-yellow-orange text-yellow-orange" : "text-line"}
            strokeWidth={on ? 1.5 : 2}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            aria-label={`Priorité ${n}`}
            aria-pressed={on}
            onClick={(e) => {
              e.stopPropagation();
              onChange(value === n ? n - 1 : n);
            }}
            className="p-0.5 transition-transform hover:scale-125"
          >
            {star}
          </button>
        ) : (
          <span key={n} className="p-0.5">
            {star}
          </span>
        );
      })}
    </span>
  );
}

export default function LeadCard({
  lead,
  dragging,
  onDragStart,
  onDragEnd,
  onPriority,
  onKeyMove,
}: {
  lead: Lead;
  dragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onPriority: (id: string, priority: number) => void;
  onKeyMove: (id: string, direction: -1 | 1) => void;
}) {
  const urgency = urgencyOf(lead.nextActivityAt);

  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", lead.id);
        onDragStart(lead.id);
      }}
      onDragEnd={onDragEnd}
      onKeyDown={(e) => {
        if (e.altKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
          e.preventDefault();
          onKeyMove(lead.id, e.key === "ArrowRight" ? 1 : -1);
        }
      }}
      className={`group relative cursor-grab select-none border border-line bg-white p-3.5 shadow-[0_1px_0_rgb(31_18_48/0.04)] transition-[box-shadow,opacity,transform] duration-200 hover:border-violet-mid/50 hover:shadow-lift active:cursor-grabbing ${
        dragging ? "opacity-40" : ""
      }`}
    >
      <Link
        href={`/admin/crm/${lead.id}`}
        draggable={false}
        aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
        className="block outline-offset-4"
      >
        <p className="line-clamp-2 text-[0.92rem] font-bold leading-snug text-violet-dark">{lead.title}</p>
        <p className="mt-1 truncate text-[0.8rem] text-gray-main">
          {lead.companyName ? `${lead.companyName} · ` : ""}
          {lead.contactName}
        </p>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wide">
        <span className="bg-violet-soft px-1.5 py-0.5 text-violet-dark">{TYPE_LABEL[lead.type]}</span>
        <span className="bg-paper px-1.5 py-0.5 text-gray-main">{SOURCE_LABEL[lead.source]}</span>
        {lead.score !== null && (
          <span className="bg-blue-main/10 px-1.5 py-0.5 text-blue-deep" title="Score d'adéquation">
            {lead.score}/100
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <PriorityStars value={lead.priority} onChange={(next) => onPriority(lead.id, next)} />
        <div className="flex items-center gap-2">
          {lead.nextActivityAt && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[0.7rem] font-bold ${URGENCY_STYLE[urgency]}`}
              title={`Prochaine activité : ${formatDate(lead.nextActivityAt, true)}`}
            >
              <CalendarClock size={12} />
              {formatDate(lead.nextActivityAt)}
            </span>
          )}
          <span
            className="flex h-6 w-6 items-center justify-center bg-violet-dark text-[0.7rem] font-bold text-white hex"
            title={staffName(lead.assignedTo)}
          >
            {staffInitial(lead.assignedTo)}
          </span>
        </div>
      </div>
    </li>
  );
}
