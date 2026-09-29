"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { eventsApi } from "@/lib/events/api";
import {
  EVENT_ORIGIN_LABEL,
  EVENT_PHASE_LABEL,
  EVENT_STATUS_LABEL,
  EVENT_STATUS_STYLE,
  EVENT_TYPE_LABEL,
  formatEventDate,
  formatEventRange,
  type EventItem,
  type EventStatus,
} from "@/lib/events/types";
import EventFormPanel from "./EventFormPanel";
import EventRegistrationsPanel from "./EventRegistrationsPanel";

type Filter = "ALL" | EventStatus;

export default function EventsWorkspace({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [form, setForm] = useState<null | "create" | EventItem>(null);
  const [registrations, setRegistrations] = useState<EventItem | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const say = (tone: "ok" | "error", text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const visible = useMemo(
    () => (filter === "ALL" ? events : events.filter((e) => e.status === filter)),
    [events, filter],
  );

  async function setStatus(event: EventItem, status: EventStatus) {
    try {
      await eventsApi.patch(event.id, { status });
      say("ok", status === "PUBLISHED" ? `« ${event.title} » est publié.` : `« ${event.title} » : ${EVENT_STATUS_LABEL[status].toLowerCase()}.`);
      router.refresh();
    } catch (e) {
      say("error", e instanceof ClientApiError ? e.message : "Le statut n'a pas pu être modifié.");
    }
  }

  async function remove(event: EventItem) {
    const warning = event.registeredCount
      ? `\n\nLes ${event.registeredCount} inscriptions seront supprimées avec lui.`
      : "";
    if (!window.confirm(`Supprimer définitivement « ${event.title} » ?${warning}`)) return;
    try {
      await eventsApi.remove(event.id);
      say("ok", `« ${event.title} » a été supprimé.`);
      router.refresh();
    } catch (e) {
      say("error", e instanceof ClientApiError ? e.message : "L'évènement n'a pas pu être supprimé.");
    }
  }

  const counts = (status: Filter) => (status === "ALL" ? events.length : events.filter((e) => e.status === status).length);

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <header className="border-b border-line bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-serif text-[1.7rem] font-extrabold leading-tight text-violet-dark">Évènements</h1>
            <p className="mt-1 text-sm text-gray-main">
              Créez les évènements d&apos;IN-CUBATOR et suivez leurs inscriptions. Les évènements publiés s&apos;affichent sur le site.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/evenements" target="_blank" rel="noreferrer" className="btn btn-ghost-dark !py-3">
              <ExternalLink size={16} /> Voir sur le site
            </a>
            <button type="button" onClick={() => setForm("create")} className="btn btn-primary !py-3">
              <Plus size={17} /> Nouvel évènement
            </button>
          </div>
        </div>

        <div role="tablist" aria-label="Filtrer par statut" className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
          {(["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-sm font-bold transition-colors ${
                filter === f ? "bg-violet-dark text-white" : "bg-paper text-violet-dark hover:bg-paper-deep"
              }`}
            >
              {f === "ALL" ? "Tous" : EVENT_STATUS_LABEL[f]} <span className="opacity-70">({counts(f)})</span>
            </button>
          ))}
        </div>
      </header>

      <div aria-live="polite" className="px-6 pt-4 lg:px-8">
        {notice && (
          <p
            role={notice.tone === "error" ? "alert" : "status"}
            className={`border px-4 py-2.5 text-sm font-semibold ${
              notice.tone === "error"
                ? "border-orange-accent/40 bg-orange-accent/10 text-orange-deep"
                : "border-green-main/40 bg-green-light/40 text-[#245a27]"
            }`}
          >
            {notice.text}
          </p>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1600px] flex-1 p-6 lg:p-8">
        {events.length === 0 ? (
          <div className="facet-tr mx-auto max-w-2xl bg-white p-10 shadow-lift">
            <h2 className="font-serif text-3xl font-bold text-violet-dark">Créez votre premier évènement.</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-main">
              Conférences, ateliers, Demo Day… Une fois publié, l&apos;évènement apparaît sur la page d&apos;accueil avec son formulaire d&apos;inscription.
            </p>
            <button type="button" onClick={() => setForm("create")} className="btn btn-primary mt-8">
              <Plus size={17} /> Nouvel évènement
            </button>
          </div>
        ) : visible.length === 0 ? (
          <p className="text-gray-main">Aucun évènement dans cette catégorie.</p>
        ) : (
          <ul className="grid gap-4">
            {visible.map((event) => (
              <li key={event.id} className="grid gap-5 bg-white p-5 shadow-lift lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold ${EVENT_STATUS_STYLE[event.status]}`}>{EVENT_STATUS_LABEL[event.status]}</span>
                    <span className="bg-violet-soft px-2.5 py-1 text-xs font-bold text-violet-dark">{EVENT_TYPE_LABEL[event.type]}</span>
                    {event.origin !== "IN_EVENT" && (
                      <span className="bg-paper px-2.5 py-1 text-xs font-bold text-gray-main">
                        {event.origin === "CO_ORGANIZED" && event.coOrganizerName ? `Avec ${event.coOrganizerName}` : EVENT_ORIGIN_LABEL[event.origin]}
                      </span>
                    )}
                    {event.status === "PUBLISHED" && event.phase === "ONGOING" && (
                      <span className="bg-green-main px-2.5 py-1 text-xs font-bold text-white">{EVENT_PHASE_LABEL.ONGOING}</span>
                    )}
                    {event.isPast && <span className="bg-paper-deep px-2.5 py-1 text-xs font-bold text-gray-main">{EVENT_PHASE_LABEL.PAST}</span>}
                    {!event.registrationsOpen && !event.isPast && (
                      <span className="bg-orange-accent/10 px-2.5 py-1 text-xs font-bold text-orange-deep">Inscriptions closes</span>
                    )}
                  </div>
                  <h2 className="mt-2 font-serif text-xl font-bold text-violet-dark">{event.title}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-main">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} /> {formatEventDate(event.startAt)}, {formatEventRange(event.startAt, event.endAt)}
                    </span>
                    {event.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} /> {event.location}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setRegistrations(event)}
                    className="inline-flex items-center gap-2 bg-paper px-3.5 py-2.5 text-sm font-bold text-violet-dark hover:bg-paper-deep"
                  >
                    <Users size={15} /> {event.registeredCount} / {event.capacity} inscrits
                  </button>
                  {event.status === "DRAFT" && (
                    <button type="button" onClick={() => setStatus(event, "PUBLISHED")} className="btn btn-primary !px-4 !py-2.5 !text-sm">
                      Publier
                    </button>
                  )}
                  {event.status === "PUBLISHED" && (
                    <button type="button" onClick={() => setStatus(event, "ARCHIVED")} className="btn btn-ghost-dark !px-4 !py-2.5 !text-sm">
                      Archiver
                    </button>
                  )}
                  {event.status === "ARCHIVED" && (
                    <button type="button" onClick={() => setStatus(event, "PUBLISHED")} className="btn btn-ghost-dark !px-4 !py-2.5 !text-sm">
                      Republier
                    </button>
                  )}
                  <button type="button" onClick={() => setForm(event)} aria-label={`Modifier ${event.title}`} className="p-2.5 text-violet-dark hover:text-orange-deep">
                    <Pencil size={17} />
                  </button>
                  <button type="button" onClick={() => remove(event)} aria-label={`Supprimer ${event.title}`} className="p-2.5 text-violet-dark hover:text-orange-deep">
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {form && (
        <EventFormPanel
          event={form === "create" ? null : form}
          onClose={() => setForm(null)}
          onSaved={(saved, created) => {
            say("ok", created ? `« ${saved.title} » créé (brouillon).` : "Modifications enregistrées.");
            router.refresh();
          }}
        />
      )}
      {registrations && (
        <EventRegistrationsPanel event={registrations} onClose={() => setRegistrations(null)} onChanged={() => router.refresh()} />
      )}
    </div>
  );
}
