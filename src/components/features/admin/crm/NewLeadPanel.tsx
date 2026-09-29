"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { crmApi } from "@/lib/crm/api";
import {
  LEAD_STAGES,
  SOURCE_LABEL,
  STAGE_META,
  TYPE_LABEL,
  staffName,
  type Lead,
  type LeadSource,
  type LeadStage,
  type LeadType,
  type StaffMember,
} from "@/lib/crm/types";
import { PriorityStars } from "./LeadCard";

export default function NewLeadPanel(props: PanelProps) {
  // Monté uniquement à l'ouverture : formulaire et erreurs repartent de zéro.
  return props.open ? <NewLeadForm {...props} /> : null;
}

type PanelProps = {
  open: boolean;
  initialStage: LeadStage;
  staff: StaffMember[];
  currentUserId: string;
  onClose: () => void;
  onCreated: (lead: Lead) => void;
};

function NewLeadForm({
  initialStage,
  staff,
  currentUserId,
  onClose,
  onCreated,
}: PanelProps) {
  const [priority, setPriority] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => firstField.current?.focus(), 60);
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
    const text = (k: string) => {
      const v = String(f.get(k) ?? "").trim();
      return v === "" ? null : v;
    };
    const scoreRaw = text("score");
    setBusy(true);
    setError(null);
    setFields({});
    try {
      const lead = await crmApi.create({
        title: String(f.get("title") ?? ""),
        contactName: String(f.get("contactName") ?? ""),
        email: text("email"),
        phone: text("phone"),
        companyName: text("companyName"),
        type: f.get("type") as LeadType,
        source: f.get("source") as LeadSource,
        stage: f.get("stage") as LeadStage,
        priority,
        score: scoreRaw === null ? null : Number(scoreRaw),
        message: text("message"),
        assignedToId: text("assignedToId"),
      });
      onCreated(lead);
      onClose();
    } catch (e) {
      if (e instanceof ClientApiError) {
        setError(e.message);
        const flat: Record<string, string> = {};
        Object.entries(e.fields ?? {}).forEach(([k, v]) => (flat[k] = Array.isArray(v) ? v[0] : v));
        setFields(flat);
      } else {
        setError("Impossible de créer le lead pour le moment.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 bg-violet-ink/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-lead-title"
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col overflow-y-auto bg-white shadow-deep"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line bg-violet-dark px-6 py-5 text-white">
          <div>
            <h2 id="new-lead-title" className="font-serif text-2xl font-bold">
              Nouveau lead
            </h2>
            <p className="mt-1 text-sm text-white/75">Ajoutez un contact au pipeline d&apos;incubation.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </header>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-4 px-6 py-6">
          <Field label="Intitulé de l'opportunité" error={fields.title}>
            <input
              ref={firstField}
              name="title"
              required
              placeholder="Ex. Projet AgriTech — Blida"
              className="field"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact" error={fields.contactName}>
              <input name="contactName" required autoComplete="off" className="field" />
            </Field>
            <Field label="Organisation / projet" error={fields.companyName}>
              <input name="companyName" autoComplete="off" className="field" />
            </Field>
            <Field label="Email" error={fields.email}>
              <input name="email" type="email" autoComplete="off" className="field" />
            </Field>
            <Field label="Téléphone" error={fields.phone}>
              <input name="phone" type="tel" autoComplete="off" className="field" />
            </Field>
            <Field label="Profil">
              <select name="type" defaultValue="STARTUP" className="field">
                {(Object.keys(TYPE_LABEL) as LeadType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Origine">
              <select name="source" defaultValue="TELEPHONE" className="field">
                {(Object.keys(SOURCE_LABEL) as LeadSource[]).map((s) => (
                  <option key={s} value={s}>
                    {SOURCE_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Étape">
              <select name="stage" defaultValue={initialStage} className="field" key={initialStage}>
                {LEAD_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_META[s].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Responsable">
              <select name="assignedToId" defaultValue={currentUserId} className="field">
                <option value="">Non assigné</option>
                {staff.map((m) => (
                  <option key={m.id} value={m.id}>
                    {staffName(m)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Score d'adéquation (0–100)" error={fields.score}>
              <input name="score" type="number" min={0} max={100} className="field" />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Priorité</span>
              <div className="flex h-[2.9rem] items-center">
                <PriorityStars value={priority} onChange={setPriority} size={22} />
              </div>
            </div>
          </div>
          <Field label="Notes" error={fields.message}>
            <textarea name="message" rows={3} className="field resize-y" />
          </Field>

          {error && (
            <p role="alert" className="text-sm font-semibold text-orange-deep">
              {error}
            </p>
          )}

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-line pt-5">
            <button type="button" onClick={onClose} className="btn btn-ghost-dark">
              Annuler
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-60">
              {busy ? "Création…" : "Créer le lead"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-violet-dark">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-orange-deep">{error}</span>}
    </label>
  );
}
