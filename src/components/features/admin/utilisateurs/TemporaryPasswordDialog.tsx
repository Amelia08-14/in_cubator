"use client";

import { useEffect, useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";

type Props = {
  /** Personne à qui transmettre l'accès. */
  name: string;
  email: string;
  password: string;
  /** « created » : compte tout juste créé ; « reset » : mot de passe réinitialisé. */
  reason: "created" | "reset";
  onClose: () => void;
};

// Le mot de passe temporaire n'est jamais enregistré en clair : c'est la seule fois où il s'affiche.
export default function TemporaryPasswordDialog({ name, email, password, reason, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Copie impossible (contexte non sécurisé) : le mot de passe reste sélectionnable à l'écran.
    }
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-violet-ink/60 backdrop-blur-[2px]" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="temp-password-title"
        className="facet-tr relative w-full max-w-lg bg-white p-8 shadow-deep"
      >
        <span className="hex flex h-12 w-12 items-center justify-center bg-orange-accent text-white">
          <KeyRound size={22} />
        </span>
        <h2 id="temp-password-title" className="mt-5 font-serif text-2xl font-bold text-violet-dark">
          {reason === "created" ? "Compte créé" : "Mot de passe réinitialisé"}
        </h2>
        <p className="mt-2 leading-relaxed text-gray-main">
          Transmettez ce mot de passe temporaire à <strong className="text-violet-dark">{name}</strong> ({email}). Aucun e-mail n&apos;est
          envoyé automatiquement.
        </p>

        <div className="mt-6 flex items-stretch gap-2">
          <output
            aria-label="Mot de passe temporaire"
            className="block min-w-0 flex-1 select-all break-all border border-line bg-cream px-4 py-3 font-mono text-base font-bold text-violet-dark"
          >
            {password}
          </output>
          <button type="button" onClick={copy} className="btn btn-ghost-dark !px-4" aria-label="Copier le mot de passe">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <p className="mt-4 border border-orange-accent/40 bg-orange-accent/10 px-4 py-3 text-sm font-semibold text-orange-deep">
          Ce mot de passe ne sera plus affiché après la fermeture de cette fenêtre. Conseillez à la personne de le remplacer par
          un mot de passe personnel.
        </p>

        <div className="mt-6 text-right">
          <button type="button" onClick={onClose} className="btn btn-primary">
            J&apos;ai transmis le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}
