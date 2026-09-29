"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { cohortsApi } from "@/lib/cohorts/api";
import { COHORT_STATUS_LABEL, type Cohort, type CohortStatus } from "@/lib/cohorts/types";

type Props = {
  /** Cohorte à modifier ; absente pour une création. */
  cohort?: Cohort | null;
  /** Une autre cohorte reçoit déjà des candidatures : on ne propose pas d'en ouvrir une seconde. */
  openExists: boolean;
  onClose: () => void;
  onSaved: (cohort: Cohort, created: boolean) => void;
};

const toInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");

export default function CohorteFormPanel({ cohort, openExists, onClose, onSaved }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const nom = String(f.get("nom") ?? "");
    const dateDebut = String(f.get("dateDebut") ?? "");
    const dateFin = String(f.get("dateFin") ?? "");
    setBusy(true);
    setError(null);
    setFields({});
    try {
      if (cohort) {
        onSaved(await cohortsApi.patch(cohort.id, { nom, dateDebut, dateFin }), false);
      } else {
        onSaved(
          await cohortsApi.create({ nom, dateDebut, dateFin, statut: f.get("statut") as CohortStatus }),
          true,
        );
      }
      onClose();
    } catch (e) {
      if (e instanceof ClientApiError) {
        setError(e.message);
        const flat: Record<string, string> = {};
        Object.entries(e.fields ?? {}).forEach(([k, v]) => (flat[k] = Array.isArray(v) ? v[0] : v));
        setFields(flat);
      } else {
        setError("Impossible d'enregistrer la cohorte pour le moment.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-violet-ink/55 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cohorte-form-title"
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col overflow-y-auto bg-white shadow-deep"
      >
        <header className="flex items-start justify-between gap-4 bg-violet-dark px-6 py-5 text-white">
          <div>
            <h2 id="cohorte-form-title" className="font-serif text-2xl font-bold">
              {cohort ? "Modifier la cohorte" : "Nouvelle cohorte"}
            </h2>
            <p className="mt-1 text-sm text-white/75">Une promotion de startups qui suit le programme en même temps.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </header>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-5 px-6 py-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Nom de la cohorte</span>
            <input ref={first} name="nom" required defaultValue={cohort?.nom ?? ""} placeholder="Ex. Cohorte 2026-S2" className="field" />
            {fields.nom && <span className="mt-1 block text-sm text-orange-deep">{fields.nom}</span>}
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Début</span>
              <input name="dateDebut" type="date" required defaultValue={toInput(cohort?.dateDebut)} className="field" />
              {fields.dateDebut && <span className="mt-1 block text-sm text-orange-deep">{fields.dateDebut}</span>}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Fin</span>
              <input name="dateFin" type="date" required defaultValue={toInput(cohort?.dateFin)} className="field" />
              {fields.dateFin && <span className="mt-1 block text-sm text-orange-deep">{fields.dateFin}</span>}
            </label>
          </div>

          {!cohort && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Statut de départ</span>
              <select name="statut" defaultValue={openExists ? "EN_COURS" : "OUVERTE_CANDIDATURES"} className="field">
                {(Object.keys(COHORT_STATUS_LABEL) as CohortStatus[])
                  .filter((s) => s !== "TERMINEE")
                  .map((s) => (
                    <option key={s} value={s} disabled={s === "OUVERTE_CANDIDATURES" && openExists}>
                      {COHORT_STATUS_LABEL[s]}
                      {s === "OUVERTE_CANDIDATURES" && openExists ? " (une cohorte est déjà ouverte)" : ""}
                    </option>
                  ))}
              </select>
              <span className="mt-1.5 block text-sm text-gray-main">
                Les nouvelles candidatures sont rattachées à la cohorte dont les candidatures sont ouvertes.
              </span>
            </label>
          )}

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
              {busy ? "Enregistrement…" : cohort ? "Enregistrer" : "Créer la cohorte"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
