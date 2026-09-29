"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { eventsApi } from "@/lib/events/api";
import { formatEventDate, formatEventTime, type EventItem } from "@/lib/events/types";

type Status = "idle" | "sending" | "done" | "error";

export default function EventRegistrationForm({ event, onDone }: { event: EventItem; onDone?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    const form = new FormData(submitEvent.currentTarget);
    setStatus("sending");
    setError(null);
    setFields({});

    const optional = (name: string) => String(form.get(name) ?? "").trim() || undefined;
    try {
      await eventsApi.register(event.slug, {
        fullName: String(form.get("fullName") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: optional("phone"),
        organization: optional("organization"),
        message: optional("message"),
        // Champ piège anti-robots : doit rester vide.
        website: optional("website"),
      });
      setStatus("done");
    } catch (e) {
      setStatus("error");
      if (e instanceof ClientApiError) {
        setError(e.message);
        const flat: Record<string, string> = {};
        Object.entries(e.fields ?? {}).forEach(([k, v]) => {
          flat[k] = Array.isArray(v) ? v[0] : v;
        });
        setFields(flat);
      } else {
        setError("Impossible d'enregistrer votre inscription pour le moment. Réessayez dans un instant.");
      }
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="text-violet-dark">
        <span className="hex flex h-10 w-10 items-center justify-center bg-orange-accent text-white">
          <Check size={20} strokeWidth={3} />
        </span>
        <h3 className="mt-4 font-serif text-2xl font-bold">Votre inscription est enregistrée.</h3>
        <p className="mt-3 leading-relaxed text-gray-main">
          Rendez-vous le {formatEventDate(event.startAt)} à {formatEventTime(event.startAt)}
          {event.location ? `, ${event.location}` : ""}. L&apos;équipe IN-CUBATOR vous contactera si le programme évolue.
        </p>
        {onDone && (
          <button type="button" onClick={onDone} className="btn btn-ghost-dark mt-6">
            Fermer
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 text-ink sm:grid-cols-2">
      <label className="block sm:col-span-1">
        <span className="mb-1.5 block text-sm font-bold text-violet-dark">Nom complet</span>
        <input name="fullName" required autoComplete="name" className="field" aria-invalid={!!fields.fullName} />
        {fields.fullName && <span className="mt-1 block text-sm text-orange-deep">{fields.fullName}</span>}
      </label>
      <label className="block sm:col-span-1">
        <span className="mb-1.5 block text-sm font-bold text-violet-dark">Email</span>
        <input name="email" type="email" required autoComplete="email" className="field" aria-invalid={!!fields.email} />
        {fields.email && <span className="mt-1 block text-sm text-orange-deep">{fields.email}</span>}
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-violet-dark">Téléphone (facultatif)</span>
        <input name="phone" type="tel" autoComplete="tel" className="field" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-violet-dark">Projet / organisation (facultatif)</span>
        <input name="organization" autoComplete="organization" className="field" />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm font-bold text-violet-dark">Un message pour l&apos;équipe (facultatif)</span>
        <textarea name="message" rows={2} className="field resize-y" />
      </label>
      {/* Piège à robots, invisible pour les humains */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {error && (
        <p role="alert" className="text-sm font-semibold text-orange-deep sm:col-span-2">
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">
          {status === "sending" ? "Envoi en cours…" : "Confirmer mon inscription"}
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
