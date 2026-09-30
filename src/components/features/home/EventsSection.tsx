import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import Reveal from "@/components/brand/Reveal";
import EventCard from "@/components/features/events/EventCard";
import type { EventItem } from "@/lib/events/types";

export default function EventsSection({ events }: { events: EventItem[] }) {
  return (
    <section id="evenements" aria-labelledby="evenements-title" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-deep">Agenda</p>
              <h2 id="evenements-title" className="mt-3 font-serif text-4xl font-extrabold leading-[1.1] text-violet-dark sm:text-5xl">
                Nos évènements<span className="text-orange-accent">.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-main">
                Conférences, ateliers, Demo Day et rencontres : venez échanger avec les startups, les mentors et les investisseurs de l&apos;écosystème.
              </p>
            </div>
            <Link href="/evenements" className="inline-flex items-center gap-2 font-bold text-violet-dark hover:text-orange-deep">
              Tous les évènements <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>

        {events.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 0.08}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="facet-tr mt-12 flex flex-col items-start gap-4 bg-white p-8 shadow-lift sm:flex-row sm:items-center sm:p-10">
              <span className="hex flex h-14 w-14 shrink-0 items-center justify-center bg-paper-deep text-violet-dark">
                <CalendarDays size={24} />
              </span>
              <div>
                <h3 className="font-serif text-2xl font-bold text-violet-dark">Le prochain évènement arrive bientôt.</h3>
                <p className="mt-1 text-gray-main">Aucun évènement n&apos;est programmé pour le moment. Revenez vite ou consultez nos évènements passés.</p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
