"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { ADMIN_SECTIONS } from "@/lib/admin-sections";
import { ClientApiError } from "@/lib/api-client-v2";
import { usersApi } from "@/lib/users/api";
import type { StaffRole, UserRow } from "@/lib/users/types";

type Props = {
  /** Compte à modifier ; absent pour une création. */
  user?: UserRow | null;
  onClose: () => void;
  /** `temporaryPassword` n'est renseigné qu'à la création avec mot de passe généré. */
  onSaved: (user: UserRow, created: boolean, temporaryPassword: string | null) => void;
};

export default function UserFormPanel({ user, onClose, onSaved }: Props) {
  const editing = Boolean(user);
  const [role, setRole] = useState<StaffRole>((user?.role as StaffRole | undefined) ?? "GESTIONNAIRE");
  const [sections, setSections] = useState<string[]>(user?.role === "GESTIONNAIRE" ? user.sections : []);
  const [passwordMode, setPasswordMode] = useState<"generate" | "manual">("generate");
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

  const toggle = (key: string) =>
    setSections((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    setBusy(true);
    setError(null);
    setFields({});

    try {
      if (user) {
        const saved = await usersApi.patch(user.id, { fullName, role, sections: role === "GESTIONNAIRE" ? sections : [] });
        onSaved(saved, false, null);
      } else {
        const { user: created, temporaryPassword } = await usersApi.create({
          fullName,
          email: String(form.get("email") ?? "").trim(),
          role,
          sections: role === "GESTIONNAIRE" ? sections : [],
          ...(passwordMode === "manual" ? { password: String(form.get("password") ?? "") } : {}),
        });
        onSaved(created, true, temporaryPassword);
      }
      onClose();
    } catch (e) {
      if (e instanceof ClientApiError) {
        setError(e.message);
        const flat: Record<string, string> = {};
        Object.entries(e.fields ?? {}).forEach(([k, v]) => (flat[k] = Array.isArray(v) ? v[0] : v));
        setFields(flat);
      } else {
        setError("Impossible d'enregistrer l'utilisateur pour le moment.");
      }
    } finally {
      setBusy(false);
    }
  }

  const err = (name: string) => (fields[name] ? <span className="mt-1 block text-sm text-orange-deep">{fields[name]}</span> : null);

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-violet-ink/55 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col overflow-y-auto bg-white shadow-deep"
      >
        <header className="flex items-start justify-between gap-4 bg-violet-dark px-6 py-5 text-white">
          <div>
            <h2 id="user-form-title" className="font-serif text-2xl font-bold">
              {editing ? "Modifier l'accès" : "Créer un utilisateur"}
            </h2>
            <p className="mt-1 text-sm text-white/75">Un membre de l&apos;équipe IN-CUBATOR qui accède à l&apos;administration.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </header>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-5 px-6 py-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Nom complet</span>
            <input ref={first} name="fullName" required defaultValue={user?.name === user?.email ? "" : (user?.name ?? "")} placeholder="Ex. Amine Baghli" className="field" />
            {err("fullName")}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Adresse e-mail</span>
            <input
              name="email"
              type="email"
              required
              disabled={editing}
              defaultValue={user?.email ?? ""}
              placeholder="exemple@email.com"
              className="field disabled:opacity-60"
            />
            {err("email")}
          </label>

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-violet-dark">Rôle</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["GESTIONNAIRE", "Manager", "Voit uniquement les sections que vous cochez."],
                  ["ADMIN", "Administrateur", "Accès complet, y compris la gestion des utilisateurs."],
                ] as const
              ).map(([value, label, hint]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col gap-1 border p-4 transition-colors ${
                    role === value ? "border-violet-dark bg-violet-soft/40" : "border-line hover:border-violet-mid"
                  }`}
                >
                  <span className="flex items-center gap-2 font-bold text-violet-dark">
                    <input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value)} className="accent-orange-accent" />
                    {label}
                  </span>
                  <span className="text-sm text-gray-main">{hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {role === "GESTIONNAIRE" ? (
            <fieldset>
              <legend className="mb-1 text-sm font-bold text-violet-dark">Sections visibles</legend>
              <p className="mb-3 text-sm text-gray-main">Le tableau de bord est visible par toute l&apos;équipe. Cochez ce que ce manager peut ouvrir.</p>
              <div className="mb-3 flex gap-4 text-sm font-bold">
                <button type="button" onClick={() => setSections(ADMIN_SECTIONS.map((s) => s.key))} className="text-violet-dark hover:text-orange-deep">
                  Tout cocher
                </button>
                <button type="button" onClick={() => setSections([])} className="text-violet-dark hover:text-orange-deep">
                  Tout décocher
                </button>
              </div>
              <ul className="divide-y divide-line border border-line">
                {ADMIN_SECTIONS.map((section) => (
                  <li key={section.key}>
                    <label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-cream">
                      <input
                        type="checkbox"
                        checked={sections.includes(section.key)}
                        onChange={() => toggle(section.key)}
                        className="mt-1 h-4 w-4 accent-orange-accent"
                      />
                      <span>
                        <span className="block font-bold text-violet-dark">{section.label}</span>
                        <span className="block text-sm text-gray-main">{section.description}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {err("sections")}
            </fieldset>
          ) : (
            <p className="border border-line bg-cream px-4 py-3 text-sm text-gray-main">
              Un administrateur a accès à toutes les sections et peut créer d&apos;autres comptes de l&apos;équipe.
            </p>
          )}

          {!editing && (
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-violet-dark">Mot de passe</legend>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="radio" checked={passwordMode === "generate"} onChange={() => setPasswordMode("generate")} className="mt-1 accent-orange-accent" />
                  <span>
                    <span className="block font-bold text-violet-dark">Générer un mot de passe temporaire</span>
                    <span className="block text-sm text-gray-main">Il s&apos;affichera une seule fois après la création, pour que vous le transmettiez.</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="radio" checked={passwordMode === "manual"} onChange={() => setPasswordMode("manual")} className="mt-1 accent-orange-accent" />
                  <span>
                    <span className="block font-bold text-violet-dark">Définir un mot de passe</span>
                    <span className="block text-sm text-gray-main">12 caractères minimum, avec une majuscule, une minuscule et un chiffre.</span>
                  </span>
                </label>
              </div>
              {passwordMode === "manual" && (
                <div className="mt-3">
                  <input name="password" type="text" required autoComplete="off" aria-label="Mot de passe" className="field font-mono" />
                  {err("password")}
                </div>
              )}
            </fieldset>
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
              {busy ? "Enregistrement…" : editing ? "Enregistrer" : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
