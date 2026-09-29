"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { realmFetch } from "@/lib/realm-fetch";

const MAX_SIZE = 5 * 1024 * 1024;

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export default function CoverUploader({ value, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Formats acceptés : JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("L'image doit faire moins de 5 Mo.");
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await realmFetch("/api/admin/events/cover", { method: "POST", body, credentials: "include" });
      const payload = (await response.json().catch(() => ({}))) as { data?: { url: string }; error?: { message: string } };
      if (!response.ok || !payload.data) {
        setError(payload.error?.message ?? "L'image n'a pas pu être envoyée.");
        return;
      }
      onChange(payload.data.url);
    } catch {
      setError("L'image n'a pas pu être envoyée. Vérifiez votre connexion.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-bold text-violet-dark">Image de couverture (facultatif)</span>

      {value ? (
        <div className="relative overflow-hidden border border-line bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'un fichier local du serveur */}
          <img src={value} alt="Aperçu de la couverture" className="aspect-[16/9] w-full object-cover" />
          <div className="absolute right-3 top-3 flex gap-2">
            <button type="button" onClick={() => input.current?.click()} disabled={busy} className="bg-white px-3 py-2 text-sm font-bold text-violet-dark shadow-lift hover:text-orange-deep disabled:opacity-60">
              {busy ? "Envoi…" : "Remplacer"}
            </button>
            <button type="button" onClick={() => onChange(null)} disabled={busy} aria-label="Retirer l'image" className="bg-white p-2 text-violet-dark shadow-lift hover:text-orange-deep disabled:opacity-60">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) void upload(file);
          }}
          className="flex w-full flex-col items-center justify-center gap-2 border border-dashed border-line bg-cream px-4 py-9 text-violet-dark transition-colors hover:border-orange-accent hover:bg-paper disabled:opacity-60"
        >
          <ImagePlus size={26} className="text-orange-accent" />
          <span className="font-bold">{busy ? "Envoi en cours…" : "Choisir ou déposer une image"}</span>
          <span className="text-sm text-gray-main">JPG, PNG ou WebP · 5 Mo maximum · format 16:9 conseillé</span>
        </button>
      )}

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      {error && (
        <span role="alert" className="mt-1.5 block text-sm font-semibold text-orange-deep">
          {error}
        </span>
      )}
    </div>
  );
}
