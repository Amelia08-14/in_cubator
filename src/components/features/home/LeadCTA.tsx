"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

import { apiClientV2, ClientApiError } from "@/lib/api-client-v2";
import Reveal from "@/components/brand/Reveal";

const PROFILES = [
  { value: "STARTUP", label: "Porteur de projet / startup" },
  { value: "INVESTISSEUR", label: "Investisseur" },
  { value: "PARTENAIRE", label: "Partenaire / entreprise" },
  { value: "MENTOR", label: "Mentor / expert" },
  { value: "DIASPORA", label: "Depuis l'étranger" },
] as const;

type Status = "idle" | "sending" | "done" | "error";

export default function LeadCTA({
  title = "Parlons de votre projet.",
  intro = "Laissez-nous vos coordonnées : un membre de l'équipe vous recontacte pour un premier échange, sans engagement.",
  source = "SITE_WEB",
  defaultProfile = "STARTUP",
}: {
  title?: string;
  intro?: string;
  source?: string;
  defaultProfile?: (typeof PROFILES)[number]["value"];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);
    setFields({});

    try {
      await apiClientV2("/crm/public/leads", {
        method: "POST",
        body: JSON.stringify({
          contactName: form.get("contactName"),
          email: form.get("email"),
          phone: form.get("phone") || undefined,
          companyName: form.get("companyName") || undefined,
          profile: form.get("profile"),
          message: form.get("message") || undefined,
          source,
          // Champ piège anti-robots : doit rester vide.
          website: form.get("website") || undefined,
        }),
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
        setError("Impossible d'envoyer votre demande pour le moment. Réessayez dans un instant.");
      }
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-paper-deep text-violet-dark">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-10 w-[42%] bg-sand/55"
        style={{ clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="mx-auto grid w-full max-w-[1320px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-32">
        <Reveal>
          <h2 className="font-serif text-4xl font-extrabold leading-[1.08] sm:text-5xl">{title}</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-main">{intro}</p>
          <ul className="mt-10 space-y-3 font-semibold">
            {["Réponse de l'équipe IN-CUBATOR", "Premier échange sans engagement", "Orientation vers le bon programme"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="hex flex h-6 w-6 items-center justify-center bg-orange-accent text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="facet-tr relative mt-10 hidden aspect-[3/2] max-w-md overflow-hidden bg-sand shadow-lift lg:block">
            <Image
              src="/photos/gen/contact.webp"
              alt="Une poignée de main au-dessus d'une table basse, deux cafés et un ordinateur portable"
              fill
              sizes="28vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {status === "done" ? (
            <div role="status" className="facet-tr bg-white p-10 text-violet-dark shadow-deep">
              <h3 className="font-serif text-3xl font-bold">Merci, c&apos;est bien reçu.</h3>
              <p className="mt-4 text-lg leading-relaxed text-gray-main">
                Un membre de l&apos;équipe vous recontacte très bientôt à l&apos;adresse indiquée.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="facet-tr grid gap-5 bg-white p-7 text-ink shadow-deep sm:grid-cols-2 sm:p-10">
              <label className="block sm:col-span-1">
                <span className="mb-1.5 block text-sm font-bold text-violet-dark">Nom complet</span>
                <input name="contactName" required autoComplete="name" className="field" aria-invalid={!!fields.contactName} />
                {fields.contactName && <span className="mt-1 block text-sm text-orange-deep">{fields.contactName}</span>}
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
                <input name="companyName" autoComplete="organization" className="field" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-bold text-violet-dark">Vous êtes</span>
                <select name="profile" defaultValue={defaultProfile} className="field">
                  {PROFILES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-bold text-violet-dark">Votre message (facultatif)</span>
                <textarea name="message" rows={3} className="field resize-y" />
              </label>
              {/* Piège à robots, invisible pour les humains */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              {error && (
                <p role="alert" className="sm:col-span-2 text-sm font-semibold text-orange-deep">
                  {error}
                </p>
              )}
              <div className="sm:col-span-2">
                <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">
                  {status === "sending" ? "Envoi en cours…" : "Être recontacté"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
