"use client";

import { useEffect, useRef, useState } from "react";

const REASONS = [
  "Projet insuffisamment mûr",
  "Ne répond plus",
  "Hors périmètre du programme",
  "A choisi un autre incubateur",
  "Calendrier incompatible",
];

export default function LostDialog(props: {
  open: boolean;
  leadTitle: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  // Monté uniquement à l'ouverture : l'état repart de zéro à chaque fois.
  return props.open ? <LostForm {...props} /> : null;
}

function LostForm({
  leadTitle,
  onCancel,
  onConfirm,
}: {
  leadTitle: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-violet-ink/55" onClick={onCancel} />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="lost-title"
        onSubmit={(e) => {
          e.preventDefault();
          if (reason.trim()) onConfirm(reason.trim());
        }}
        className="facet-tr relative w-full max-w-md bg-white p-7 shadow-deep"
      >
        <h2 id="lost-title" className="font-serif text-2xl font-bold text-violet-dark">
          Marquer comme perdu
        </h2>
        <p className="mt-2 text-sm text-gray-main">
          « {leadTitle} » sortira du pipeline. Indiquez le motif pour alimenter vos analyses.
        </p>
        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-bold text-violet-dark">Motif de perte</span>
          <input
            ref={input}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={191}
            className="field"
            placeholder="Saisissez ou choisissez un motif"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className="border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-violet-dark transition-colors hover:border-violet-main hover:bg-violet-soft"
            >
              {r}
            </button>
          ))}
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn btn-ghost-dark">
            Annuler
          </button>
          <button type="submit" disabled={!reason.trim()} className="btn btn-primary disabled:opacity-50">
            Confirmer
          </button>
        </div>
      </form>
    </div>
  );
}
