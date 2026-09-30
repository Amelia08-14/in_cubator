import type { Metadata } from "next";

import PageHero from "@/components/brand/PageHero";
import EventCard from "@/components/features/events/EventCard";
import type { EventItem } from "@/lib/events/types";
import { publicApi } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Évènements",
  description: "Conférences, ateliers, Demo Day et rencontres organisés par IN-CUBATOR : découvrez l'agenda et inscrivez-vous.",
};
export const dynamic = "force-dynamic";

async function load(scope: "upcoming" | "past"): Promise<EventItem[]> {
  try {
    return (await publicApi<{ events: EventItem[] }>(`/api/events?scope=${scope}&limit=24`)).events;
  } catch {
    return [];
  }
}

export default async function EvenementsPage() {
  const [upcoming, past] = await Promise.all([load("upcoming"), load("past")]);

  return (
    <main>
      <PageHero
        title={<>Nos évènements<span className="text-orange-accent">.</span></>}
        text="Conférences, ateliers, Demo Day et rencontres : l'écosystème IN-CUBATOR se retrouve ici. Inscription gratuite, sans compte."
      />

      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <h2 className="font-serif text-3xl font-extrabold text-violet-dark">À venir et en cours</h2>
          {upcoming.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-xl text-lg text-gray-main">
              Aucun évènement n&apos;est programmé pour le moment. Le prochain sera annoncé ici.
            </p>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="bg-paper py-16 lg:py-20">
          <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
            <h2 className="font-serif text-3xl font-extrabold text-violet-dark">Évènements passés</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
