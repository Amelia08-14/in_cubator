import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";

import PageHero from "@/components/brand/PageHero";
import EventRegistrationForm from "@/components/features/events/EventRegistrationForm";
import {
  EVENT_PHASE_LABEL,
  EVENT_TYPE_LABEL,
  formatEventDate,
  formatEventRange,
  type EventItem,
} from "@/lib/events/types";
import { ApiError, publicApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

async function load(slug: string): Promise<EventItem> {
  try {
    return (await publicApi<{ event: EventItem }>(`/api/events/${encodeURIComponent(slug)}`)).event;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await load(slug);
    return { title: event.title, description: event.summary ?? event.description.slice(0, 160) };
  } catch {
    return { title: "Évènement" };
  }
}

export default async function EvenementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await load(slug);

  return (
    <main>
      <PageHero
        before={
          <Link href="/evenements" className="inline-flex items-center gap-2 text-sm font-bold text-violet-dark hover:text-orange-deep">
            <ArrowLeft size={16} /> Tous les évènements
          </Link>
        }
        title={<>{event.title}</>}
        text={event.summary ?? undefined}
      />

      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {event.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element -- URL saisie en back-office, domaine libre
              <img src={event.coverImage} alt="" className="mb-8 aspect-[16/9] w-full object-cover shadow-lift" />
            )}
            {event.phase !== "UPCOMING" && (
              <p
                className={`mb-6 inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-white ${
                  event.phase === "ONGOING" ? "bg-green-main" : "bg-violet-ink"
                }`}
              >
                {event.phase === "ONGOING" && <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-white" />}
                {EVENT_PHASE_LABEL[event.phase]}
              </p>
            )}
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3 bg-white p-5 shadow-lift">
                <CalendarDays className="mt-0.5 shrink-0 text-orange-accent" size={20} />
                <div>
                  <p className="font-bold capitalize text-violet-dark">{formatEventDate(event.startAt)}</p>
                  <p className="text-sm text-gray-main">{formatEventRange(event.startAt, event.endAt)} (heure d&apos;Alger)</p>
                </div>
              </li>
              {event.location && (
                <li className="flex items-start gap-3 bg-white p-5 shadow-lift">
                  <MapPin className="mt-0.5 shrink-0 text-orange-accent" size={20} />
                  <div>
                    <p className="font-bold text-violet-dark">{event.location}</p>
                    <p className="text-sm text-gray-main">{EVENT_TYPE_LABEL[event.type]}</p>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3 bg-white p-5 shadow-lift">
                <Users className="mt-0.5 shrink-0 text-orange-accent" size={20} />
                <div>
                  <p className="font-bold text-violet-dark">
                    {event.spotsLeft} place{event.spotsLeft > 1 ? "s" : ""} restante{event.spotsLeft > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-main">sur {event.capacity}</p>
                </div>
              </li>
              {event.origin === "CO_ORGANIZED" && event.coOrganizerName && (
                <li className="bg-white p-5 shadow-lift">
                  <p className="text-sm text-gray-main">Co-organisé avec</p>
                  <p className="font-bold text-violet-dark">{event.coOrganizerName}</p>
                </li>
              )}
            </ul>

            <div className="mt-10 whitespace-pre-line text-lg leading-relaxed text-ink">{event.description}</div>

            {event.videoUrl && (
              <a href={event.videoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost-dark mt-8 inline-flex">
                Revoir la vidéo de l&apos;évènement
              </a>
            )}
          </div>

          <aside id="inscription" className="facet-tr h-fit scroll-mt-28 bg-white p-7 shadow-deep sm:p-9">
            {event.canRegister ? (
              <>
                <h2 className="font-serif text-2xl font-bold text-violet-dark">Je m&apos;inscris</h2>
                <p className="mb-6 mt-2 text-sm text-gray-main">Gratuit, sans création de compte.</p>
                <EventRegistrationForm event={event} />
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-violet-dark">
                  {event.isPast ? "Évènement passé : inscriptions closes" : event.isFull ? "Cet évènement est complet" : "Inscriptions closes"}
                </h2>
                <p className="mt-3 leading-relaxed text-gray-main">
                  Découvrez les prochains rendez-vous d&apos;IN-CUBATOR sur la page des évènements.
                </p>
                <Link href="/evenements" className="btn btn-primary mt-6 inline-flex">
                  Voir l&apos;agenda
                </Link>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
