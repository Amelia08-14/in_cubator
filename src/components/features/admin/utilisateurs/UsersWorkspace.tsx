"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { KeyRound, Pencil, Plus, Power, Search } from "lucide-react";

import { ADMIN_SECTIONS, ROLE_LABEL } from "@/lib/admin-sections";
import { ClientApiError } from "@/lib/api-client-v2";
import { usersApi } from "@/lib/users/api";
import type { UserRow, UsersStats } from "@/lib/users/types";
import TemporaryPasswordDialog from "./TemporaryPasswordDialog";
import UserFormPanel from "./UserFormPanel";

const ROLE_STYLE: Record<string, string> = {
  ADMIN: "bg-orange-accent/10 text-orange-deep",
  GESTIONNAIRE: "bg-violet-soft text-violet-dark",
  PORTEUR_STARTUP: "bg-blue-main/10 text-blue-deep",
  MENTOR_EXPERT: "bg-violet-main/10 text-violet-main",
  INVESTISSEUR: "bg-green-light/60 text-[#245a27]",
  PARTENAIRE: "bg-paper-deep text-gray-main",
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Africa/Algiers" });

type Revealed = { name: string; email: string; password: string; reason: "created" | "reset" };
type Filter = "ALL" | "STAFF" | "MEMBERS";

function accessLabel(user: UserRow): { text: string; title?: string } {
  if (!user.isStaff) return { text: "—" };
  if (user.role === "ADMIN") return { text: "Toutes les sections" };
  const labels = ADMIN_SECTIONS.filter((s) => user.sections.includes(s.key)).map((s) => s.label);
  return { text: `${labels.length} section${labels.length > 1 ? "s" : ""}`, title: labels.join(", ") };
}

export default function UsersWorkspace({
  users,
  stats,
  currentUserId,
}: {
  users: UserRow[];
  stats: UsersStats;
  currentUserId: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<null | "create" | UserRow>(null);
  const [revealed, setRevealed] = useState<Revealed | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const say = (tone: "ok" | "error", text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice(null), 5000);
  };
  const fail = (e: unknown, fallback: string) => say("error", e instanceof ClientApiError ? e.message : fallback);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (filter === "ALL" || (filter === "STAFF" ? u.isStaff : !u.isStaff)) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    );
  }, [users, query, filter]);

  async function toggleActive(user: UserRow) {
    const verb = user.actif ? "Désactiver" : "Réactiver";
    if (!window.confirm(`${verb} le compte de ${user.name} ?${user.actif ? "\n\nSes sessions ouvertes seront fermées." : ""}`)) return;
    try {
      await usersApi.patch(user.id, { actif: !user.actif });
      say("ok", `Compte de ${user.name} ${user.actif ? "désactivé" : "réactivé"}.`);
      router.refresh();
    } catch (e) {
      fail(e, "Le statut n'a pas pu être modifié.");
    }
  }

  async function resetPassword(user: UserRow) {
    if (!window.confirm(`Réinitialiser le mot de passe de ${user.name} ?\n\nSes sessions ouvertes seront fermées et un nouveau mot de passe temporaire sera généré.`)) return;
    try {
      const password = await usersApi.resetPassword(user.id);
      setRevealed({ name: user.name, email: user.email, password, reason: "reset" });
    } catch (e) {
      fail(e, "Le mot de passe n'a pas pu être réinitialisé.");
    }
  }

  const cards: [string, number][] = [
    ["Comptes", stats.total],
    ["Actifs", stats.actifs],
    ["Équipe", stats.equipe],
    ["Désactivés", stats.desactives],
  ];

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <header className="border-b border-line bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-serif text-[1.7rem] font-extrabold leading-tight text-violet-dark">Utilisateurs</h1>
            <p className="mt-1 text-sm text-gray-main">
              Créez les comptes de l&apos;équipe et choisissez, pour chaque manager, les sections qu&apos;il peut voir.
            </p>
          </div>
          <button type="button" onClick={() => setForm("create")} className="btn btn-primary !py-3">
            <Plus size={17} /> Créer un utilisateur
          </button>
        </div>
      </header>

      <div aria-live="polite" className="px-6 pt-4 lg:px-8">
        {notice && (
          <p
            role={notice.tone === "error" ? "alert" : "status"}
            className={`border px-4 py-2.5 text-sm font-semibold ${
              notice.tone === "error"
                ? "border-orange-accent/40 bg-orange-accent/10 text-orange-deep"
                : "border-green-main/40 bg-green-light/40 text-[#245a27]"
            }`}
          >
            {notice.text}
          </p>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1600px] flex-1 p-6 lg:p-8">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="bg-white p-5 shadow-lift">
              <dt className="text-sm font-bold text-gray-main">{label}</dt>
              <dd className="mt-1 font-serif text-3xl font-extrabold tabular text-violet-dark">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Rechercher un utilisateur</span>
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-main" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par nom ou e-mail" className="field !pl-10" />
          </label>
          <label>
            <span className="sr-only">Filtrer</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="field !w-auto">
              <option value="ALL">Tous les comptes</option>
              <option value="STAFF">Équipe (admins et managers)</option>
              <option value="MEMBERS">Membres (startups, mentors…)</option>
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto bg-white shadow-lift">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-xs font-bold uppercase tracking-wider text-gray-main">
                <th className="px-5 py-3.5">Utilisateur</th>
                <th className="px-5 py-3.5">Rôle</th>
                <th className="px-5 py-3.5">Accès</th>
                <th className="px-5 py-3.5">Créé le</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((user) => {
                const access = accessLabel(user);
                const isMe = user.id === currentUserId;
                return (
                  <tr key={user.id} className={user.actif ? "" : "bg-paper/60"}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center bg-violet-soft font-serif text-sm font-bold text-violet-dark">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-violet-dark">
                            {user.name}
                            {isMe && <span className="ml-2 text-xs font-bold text-orange-deep">(vous)</span>}
                          </p>
                          <p className="truncate text-sm text-gray-main">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold ${ROLE_STYLE[user.role] ?? "bg-paper-deep text-gray-main"}`}>
                        {ROLE_LABEL[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-main" title={access.title}>
                      {access.text}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-main tabular">{dateFormat.format(new Date(user.createdAt))}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-2 text-sm font-bold ${user.actif ? "text-[#245a27]" : "text-orange-deep"}`}>
                        <span aria-hidden className={`h-2 w-2 rounded-full ${user.actif ? "bg-green-main" : "bg-orange-accent"}`} />
                        {user.actif ? "Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {user.isStaff && (
                          <button type="button" onClick={() => setForm(user)} aria-label={`Modifier ${user.name}`} title="Modifier le rôle et les sections" className="p-2 text-violet-dark hover:text-orange-deep">
                            <Pencil size={16} />
                          </button>
                        )}
                        <button type="button" onClick={() => resetPassword(user)} aria-label={`Réinitialiser le mot de passe de ${user.name}`} title="Réinitialiser le mot de passe" className="p-2 text-violet-dark hover:text-orange-deep">
                          <KeyRound size={16} />
                        </button>
                        {!isMe && (
                          <button type="button" onClick={() => toggleActive(user)} aria-label={`${user.actif ? "Désactiver" : "Réactiver"} ${user.name}`} title={user.actif ? "Désactiver" : "Réactiver"} className="p-2 text-violet-dark hover:text-orange-deep">
                            <Power size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && <p className="px-5 py-8 text-center text-gray-main">Aucun utilisateur ne correspond.</p>}
        </div>
        <p className="mt-3 text-sm text-gray-main">
          {visible.length} compte{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""} sur {users.length}.
        </p>
      </div>

      {form && (
        <UserFormPanel
          user={form === "create" ? null : form}
          onClose={() => setForm(null)}
          onSaved={(saved, created, temporaryPassword) => {
            if (created && temporaryPassword) {
              setRevealed({ name: saved.name, email: saved.email, password: temporaryPassword, reason: "created" });
            } else {
              say("ok", created ? `Compte de ${saved.name} créé.` : "Modifications enregistrées.");
            }
            router.refresh();
          }}
        />
      )}
      {revealed && <TemporaryPasswordDialog {...revealed} onClose={() => setRevealed(null)} />}
    </div>
  );
}
