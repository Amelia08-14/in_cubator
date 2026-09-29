"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import CoverUploader from "./CoverUploader";
import { eventsApi, type EventInput } from "@/lib/events/api";
import {
  EVENT_ORIGIN_LABEL,
  EVENT_STATUS_LABEL,
  EVENT_TYPE_LABEL,
  fromDatetimeLocal,
  toDatetimeLocal,
  type EventItem,
  type EventOrigin,
  type EventStatus,
  type EventType,
} from "@/lib/events/types";

type Props = {
  /** Évènement à modifier ; absent pour une création. */
  event?: EventItem | null;
  onClose: () => void;
  onSaved: (event: EventItem, created: boolean) => void;
};

const text = (f: FormData, name: string) => {
  const value = String(f.get(name) ?? "").trim();
  return value === "" ? null : value;
};

export default function EventFormPanel({ event, onClose, onSaved }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [origin, setOrigin] = useState<EventOrigin>(event?.origin ?? "IN_EVENT");
  const [coverImage, setCoverImage] = useState<string | null>(event?.coverImage ?? null);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => first.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function submit(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    const f = new FormData(submitEvent.currentTarget);
    const input: EventInput = {
      title: String(f.get("title") ?? "").trim(),
      summary: text(f, "summary"),
      description: String(f.get("description") ?? "").trim(),
      type: f.get("type") as EventType,
      origin,
      location: text(f, "location"),
      startAt: fromDatetimeLocal(String(f.get("startAt"))),
      endAt: fromDatetimeLocal(String(f.get("endAt"))),
      capacity: Number(f.get("capacity")),
      coverImage,
      videoUrl: text(f, "videoUrl"),
      coOrganizerName: origin === "CO_ORGANIZED" ? text(f, "coOrganizerName") : null,
      registrationsOpen: f.get("registrationsOpen") === "on",
      status: f.get("status") as EventStatus,
    };

    setBusy(true);
    setError(null);
    setFields({});
    try {
      onSaved(event ? await eventsApi.patch(event.id, input) : await eventsApi.create(input), !event);
      onClose();
    } catch (e) {
      if (e instanceof ClientApiError) {
        setError(e.message);
        const flat: Record<string, string> = {};
        Object.entries(e.fields ?? {}).forEach(([k, v]) => (flat[k] = Array.isArray(v) ? v[0] : v));
        setFields(flat);
      } else {
        setError("Impossible d'enregistrer l'évènement pour le moment.");
      }
    } finally {
      setBusy(false);
    }
  }

  const err = (name: string) =>
    fields[name] ? <span className="mt-1 block text-sm text-orange-deep">{fields[name]}</span> : null;

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-violet-ink/55 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col overflow-y-auto bg-white shadow-deep"
      >
        <header className="flex items-start justify-between gap-4 bg-violet-dark px-6 py-5 text-white">
          <div>
            <h2 id="event-form-title" className="font-serif text-2xl font-bold">
              {event ? "Modifier l'évènement" : "Nouvel évènement"}
            </h2>
            <p className="mt-1 text-sm text-white/75">
              Publié, il apparaît sur la page d&apos;accueil et sur la page Évènements, avec son formulaire d&apos;inscription.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </header>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-5 px-6 py-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Titre</span>
            <input ref={first} name="title" required defaultValue={event?.title ?? ""} placeholder="Ex. Demo Day — Cohorte 2026-S1" className="field" />
            {err("title")}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Accroche (facultatif)</span>
            <input name="summary" maxLength={280} defaultValue={event?.summary ?? ""} placeholder="Une phrase affichée sur la carte de l'évènement" className="field" />
            {err("summary")}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Description</span>
            <textarea name="description" required rows={5} defaultValue={event?.description ?? ""} className="field resize-y" />
            {err("description")}
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Type</span>
              <select name="type" defaultValue={event?.type ?? "CONFERENCE"} className="field">
                {(Object.keys(EVENT_TYPE_LABEL) as EventType[]).map((t) => (
                  <option key={t} value={t}>
                    {EVENT_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Catégorie</span>
              <select value={origin} onChange={(e) => setOrigin(e.target.value as EventOrigin)} className="field">
                {(Object.keys(EVENT_ORIGIN_LABEL) as EventOrigin[]).map((o) => (
                  <option key={o} value={o}>
                    {EVENT_ORIGIN_LABEL[o]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {origin === "CO_ORGANIZED" && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Co-organisateur</span>
              <input name="coOrganizerName" defaultValue={event?.coOrganizerName ?? ""} className="field" />
              {err("coOrganizerName")}
            </label>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Début (heure d&apos;Alger)</span>
              <input name="startAt" type="datetime-local" required defaultValue={toDatetimeLocal(event?.startAt)} className="field" />
              {err("startAt")}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Fin</span>
              <input name="endAt" type="datetime-local" required defaultValue={toDatetimeLocal(event?.endAt)} className="field" />
              {err("endAt")}
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Lieu</span>
              <input name="location" defaultValue={event?.location ?? ""} placeholder="Ex. IN NETWORK Hydra, Alger" className="field" />
              {err("location")}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Places</span>
              <input name="capacity" type="number" min={1} required defaultValue={event?.capacity ?? 50} className="field" />
              {err("capacity")}
            </label>
          </div>

          <div>
            <CoverUploader value={coverImage} onChange={setCoverImage} />
            {err("coverImage")}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Vidéo de récap (URL, facultatif)</span>
            <input name="videoUrl" type="url" defaultValue={event?.videoUrl ?? ""} placeholder="https://…" className="field" />
            {err("videoUrl")}
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Statut</span>
              <select name="status" defaultValue={event?.status ?? "DRAFT"} className="field">
                {(Object.keys(EVENT_STATUS_LABEL) as EventStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {EVENT_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <span className="mt-1.5 block text-sm text-gray-main">Seuls les évènements publiés sont visibles sur le site.</span>
            </label>
            <label className="flex items-start gap-3 pt-7">
              <input name="registrationsOpen" type="checkbox" defaultChecked={event?.registrationsOpen ?? true} className="mt-1 h-4 w-4 accent-orange-accent" />
              <span className="text-sm font-bold text-violet-dark">Inscriptions ouvertes</span>
            </label>
          </div>

          {error && (
            <p role="alert" className="border border-orange-accent/40 bg-orange-accent/10 px-4 py-3 text-sm font-semibold text-orange-deep">
              {error}
            </p>
          )}

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-line pt-5">
            <button type="button" onClick={onClose} className="btn btn-ghost-dark">
              Annuler
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-60">
              {busy ? "Enregistrement…" : event ? "Enregistrer" : "Créer l'évènement"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
