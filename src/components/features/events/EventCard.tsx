"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, X } from "lucide-react";

import {
  EVENT_ORIGIN_LABEL,
  EVENT_PHASE_LABEL,
  EVENT_TYPE_LABEL,
  formatEventDay,
  formatEventMonth,
  formatEventRange,
  type EventItem,
} from "@/lib/events/types";
import EventRegistrationForm from "./EventRegistrationForm";

function RegistrationDialog({ event, onClose }: { event: EventItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-violet-ink/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-dialog-title"
        data-lenis-prevent
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white p-7 shadow-deep sm:p-10"
      >
        <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 p-1 text-gray-main hover:text-violet-dark">
          <X size={22} />
        </button>
        <h3 id="event-dialog-title" className="pr-8 font-serif text-2xl font-bold text-violet-dark">
          S&apos;inscrire à « {event.title} »
        </h3>
        <p className="mb-6 mt-2 text-sm text-gray-main">
          {event.spotsLeft} place{event.spotsLeft > 1 ? "s" : ""} restante{event.spotsLeft > 1 ? "s" : ""}. Gratuit, sans compte.
        </p>
        <EventRegistrationForm event={event} onDone={onClose} />
      </div>
    </div>
  );
}

export default function EventCard({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false);
  const href = `/evenements/${event.slug}`;

  return (
    <article className="facet-tr group flex h-full flex-col bg-white shadow-lift transition-shadow hover:shadow-deep">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-violet-dark" aria-label={event.title}>
        {event.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL saisie en back-office, domaine libre
          <img src={event.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div aria-hidden className="h-full w-full bg-gradient-to-br from-violet-dark via-violet-mid to-violet-main" />
        )}
        <div className="absolute left-4 top-4 flex flex-col items-center bg-white px-3 py-2 text-center text-violet-dark shadow-lift">
          <span className="font-serif text-2xl font-extrabold leading-none tabular">{formatEventDay(event.startAt)}</span>
          <span className="mt-1 text-xs font-bold uppercase tracking-wider text-orange-deep">{formatEventMonth(event.startAt)}</span>
        </div>
        <span className="absolute bottom-4 left-4 bg-orange-accent px-2.5 py-1 text-xs font-bold text-white">{EVENT_TYPE_LABEL[event.type]}</span>
        {event.phase === "ONGOING" && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-2 bg-green-main px-2.5 py-1 text-xs font-bold text-white shadow-lift">
            <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-white" />
            {EVENT_PHASE_LABEL.ONGOING}
          </span>
        )}
        {event.phase === "PAST" && (
          <span className="absolute right-4 top-4 bg-violet-ink/85 px-2.5 py-1 text-xs font-bold text-white shadow-lift">
            {EVENT_PHASE_LABEL.PAST}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-bold leading-snug text-violet-dark">
          <Link href={href} className="hover:text-orange-deep">
            {event.title}
          </Link>
        </h3>
        {event.origin === "CO_ORGANIZED" && event.coOrganizerName ? (
          <p className="mt-1 text-sm font-semibold text-violet-main">Avec {event.coOrganizerName}</p>
        ) : event.origin === "EXTERNAL" ? (
          <p className="mt-1 text-sm font-semibold text-violet-main">{EVENT_ORIGIN_LABEL.EXTERNAL}</p>
        ) : null}
        {event.summary && <p className="mt-3 leading-relaxed text-gray-main">{event.summary}</p>}

        <ul className="mt-4 space-y-1.5 text-sm text-gray-main">
          <li className="flex items-center gap-2">
            <CalendarDays size={15} className="shrink-0 text-orange-accent" /> {formatEventRange(event.startAt, event.endAt)}
          </li>
          {event.location && (
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-orange-accent" /> {event.location}
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          {event.canRegister ? (
            <button type="button" onClick={() => setOpen(true)} className="btn btn-primary !px-5 !py-3 !text-sm">
              S&apos;inscrire
            </button>
          ) : (
            <span className="bg-paper px-3 py-2 text-sm font-bold text-gray-main">
              {event.isPast ? EVENT_PHASE_LABEL.PAST : event.isFull ? "Complet" : "Inscriptions closes"}
            </span>
          )}
          <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-dark hover:text-orange-deep">
            Détails <ArrowRight size={15} />
          </Link>
          {event.canRegister && event.spotsLeft <= 10 && (
            <span className="ml-auto text-xs font-bold text-orange-deep">
              {event.spotsLeft} place{event.spotsLeft > 1 ? "s" : ""} restante{event.spotsLeft > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {open && <RegistrationDialog event={event} onClose={() => setOpen(false)} />}
    </article>
  );
}
