"use client";

import { useEffect, useState } from "react";
import { FileDown, X } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { eventsApi } from "@/lib/events/api";
import {
  REGISTRATION_STATUS_LABEL,
  formatEventDate,
  type EventItem,
  type EventRegistrationRow,
  type RegistrationStatus,
} from "@/lib/events/types";

const csvCell = (value: string | number | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;

// Export : CSV avec séparateur « ; » et BOM pour une ouverture directe dans Excel.
function downloadCsv(event: EventItem, rows: EventRegistrationRow[]) {
  const head = ["Nom", "Email", "Téléphone", "Organisation", "Message", "Statut", "Inscrit le"];
  const lines = rows.map((r) =>
    [r.fullName, r.email, r.phone, r.organization, r.message, REGISTRATION_STATUS_LABEL[r.status], r.createdAt.slice(0, 10)]
      .map(csvCell)
      .join(";"),
  );
  const blob = new Blob(["﻿" + [head.map(csvCell).join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inscrits-${event.slug}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function EventRegistrationsPanel({
  event,
  onClose,
  onChanged,
}: {
  event: EventItem;
  onClose: () => void;
  /** Appelé après un changement de statut, pour rafraîchir les compteurs. */
  onChanged: () => void;
}) {
  const [rows, setRows] = useState<EventRegistrationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    eventsApi
      .registrations(event.id)
      .then((list) => alive && setRows(list))
      .catch(() => alive && setError("Impossible de charger les inscrits."));
    return () => {
      alive = false;
    };
  }, [event.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function setStatus(row: EventRegistrationRow, status: RegistrationStatus) {
    setError(null);
    try {
      await eventsApi.setRegistrationStatus(event.id, row.id, status);
      setRows((current) => current?.map((r) => (r.id === row.id ? { ...r, status } : r)) ?? null);
      onChanged();
    } catch (e) {
      setError(e instanceof ClientApiError ? e.message : "Le statut n'a pas pu être modifié.");
    }
  }

  const active = rows?.filter((r) => r.status !== "CANCELLED").length ?? 0;

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-violet-ink/55 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-registrations-title"
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[760px] flex-col overflow-y-auto bg-white shadow-deep"
      >
        <header className="flex items-start justify-between gap-4 bg-violet-dark px-6 py-5 text-white">
          <div>
            <h2 id="event-registrations-title" className="font-serif text-2xl font-bold">
              Inscrits
            </h2>
            <p className="mt-1 text-sm text-white/75">
              {event.title} · {formatEventDate(event.startAt)}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <p className="text-sm font-semibold text-violet-dark">
            {active} / {event.capacity} places prises
          </p>
          {rows && rows.length > 0 && (
            <button type="button" onClick={() => downloadCsv(event, rows)} className="btn btn-ghost-dark !py-2.5">
              <FileDown size={16} /> Exporter (CSV)
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mx-6 mt-4 border border-orange-accent/40 bg-orange-accent/10 px-4 py-3 text-sm font-semibold text-orange-deep">
            {error}
          </p>
        )}

        <div className="flex-1 px-6 py-5">
          {rows === null && !error && <p className="text-gray-main">Chargement…</p>}
          {rows?.length === 0 && <p className="text-gray-main">Aucune inscription pour le moment.</p>}
          {rows && rows.length > 0 && (
            <ul className="divide-y divide-line">
              {rows.map((r) => (
                <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className={`font-bold text-violet-dark ${r.status === "CANCELLED" ? "line-through opacity-60" : ""}`}>{r.fullName}</p>
                    <p className="text-sm text-gray-main">
                      <a href={`mailto:${r.email}`} className="hover:text-orange-deep hover:underline">
                        {r.email}
                      </a>
                      {r.phone ? ` · ${r.phone}` : ""}
                    </p>
                    {r.organization && <p className="text-sm text-gray-main">{r.organization}</p>}
                    {r.message && <p className="mt-1 text-sm italic text-gray-main">« {r.message} »</p>}
                  </div>
                  <label className="shrink-0">
                    <span className="sr-only">Statut de {r.fullName}</span>
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r, e.target.value as RegistrationStatus)}
                      className="field !w-auto !py-2 text-sm"
                    >
                      {(Object.keys(REGISTRATION_STATUS_LABEL) as RegistrationStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {REGISTRATION_STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
