"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Mail,
  MessageSquareText,
  Phone,
  RotateCcw,
  StickyNote,
  Trash2,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { crmApi } from "@/lib/crm/api";
import {
  ACTIVITY_LABEL,
  LEAD_STAGES,
  SOURCE_LABEL,
  STAGE_META,
  STATUS_LABEL,
  TYPE_LABEL,
  formatDate,
  relativeDays,
  staffName,
  urgencyOf,
  type ActivityType,
  type LeadActivity,
  type LeadDetailData,
  type LeadSource,
  type LeadType,
  type StaffMember,
} from "@/lib/crm/types";
import { PriorityStars } from "./LeadCard";
import LostDialog from "./LostDialog";

const COMPOSER_TYPES: { id: Exclude<ActivityType, "SYSTEME">; icon: typeof StickyNote }[] = [
  { id: "NOTE", icon: StickyNote },
  { id: "APPEL", icon: Phone },
  { id: "EMAIL", icon: Mail },
  { id: "REUNION", icon: Users },
  { id: "TACHE", icon: CalendarClock },
];

const ACTIVITY_ICON: Record<ActivityType, typeof StickyNote> = {
  NOTE: StickyNote,
  APPEL: Phone,
  EMAIL: Mail,
  REUNION: Users,
  TACHE: CalendarClock,
  SYSTEME: MessageSquareText,
};

export default function LeadDetail({
  initial,
  staff,
  isAdmin,
}: {
  initial: LeadDetailData;
  staff: StaffMember[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initial);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showLost, setShowLost] = useState(false);
  const [priority, setPriority] = useState(initial.priority);

  const [actType, setActType] = useState<Exclude<ActivityType, "SYSTEME">>("NOTE");
  const [actContent, setActContent] = useState("");
  const [actDue, setActDue] = useState("");
  const [posting, setPosting] = useState(false);

  const say = (tone: "ok" | "error", text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice(null), 4500);
  };
  const fail = (e: unknown, fallback: string) => say("error", e instanceof ClientApiError ? e.message : fallback);

  // La fiche recharge tout le détail pour garder journal et statut synchronisés.
  async function reload() {
    setLead(await crmApi.detail(lead.id));
  }

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      await reload();
      say("ok", success);
    } catch (e) {
      fail(e, "L'action a échoué.");
    }
  }

  async function saveInfo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const text = (k: string) => {
      const v = String(f.get(k) ?? "").trim();
      return v === "" ? null : v;
    };
    const scoreRaw = text("score");
    setSaving(true);
    await run(
      () =>
        crmApi.patch(lead.id, {
          title: String(f.get("title") ?? ""),
          contactName: String(f.get("contactName") ?? ""),
          email: text("email"),
          phone: text("phone"),
          companyName: text("companyName"),
          type: f.get("type") as LeadType,
          source: f.get("source") as LeadSource,
          score: scoreRaw === null ? null : Number(scoreRaw),
          message: text("message"),
          assignedToId: text("assignedToId"),
          priority,
        }),
      "Modifications enregistrées.",
    );
    setSaving(false);
  }

  async function post(event: React.FormEvent) {
    event.preventDefault();
    if (!actContent.trim()) return;
    setPosting(true);
    await run(
      () =>
        crmApi.addActivity(lead.id, {
          type: actType,
          content: actContent.trim(),
          dueAt: actDue ? new Date(actDue).toISOString() : null,
        }),
      actDue ? "Activité planifiée." : "Entrée ajoutée au journal.",
    );
    setActContent("");
    setActDue("");
    setPosting(false);
  }

  async function remove() {
    if (!window.confirm(`Supprimer définitivement « ${lead.title} » ?`)) return;
    try {
      await crmApi.remove(lead.id);
      router.push("/admin/crm");
      router.refresh();
    } catch (e) {
      fail(e, "Suppression impossible.");
    }
  }

  const closed = lead.status !== "OUVERT";
  const currentIndex = LEAD_STAGES.indexOf(lead.stage);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white px-6 py-5 lg:px-8">
        <Link
          href="/admin/crm"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-main transition-colors hover:text-violet-dark"
        >
          <ArrowLeft size={16} /> Retour au pipeline
        </Link>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="tabular text-sm font-bold text-gray-main">
              {lead.reference} · {TYPE_LABEL[lead.type]} · {SOURCE_LABEL[lead.source]}
            </p>
            <h1 className="mt-1 font-serif text-[1.9rem] font-extrabold leading-tight text-violet-dark">{lead.title}</h1>
            <p className="mt-1 text-gray-main">
              Créé {relativeDays(lead.createdAt)} · en {STAGE_META[lead.stage].short.toLowerCase()} depuis{" "}
              {relativeDays(lead.stageChangedAt).replace("il y a ", "")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {lead.status === "OUVERT" ? (
              <>
                <button onClick={() => run(() => crmApi.win(lead.id), "Lead marqué comme gagné.")} className="btn !bg-green-main text-white hover:!bg-[#3f7d42]">
                  <Trophy size={16} /> Gagné
                </button>
                <button onClick={() => setShowLost(true)} className="btn btn-ghost-dark">
                  <XCircle size={16} /> Perdu
                </button>
              </>
            ) : (
              <>
                <span
                  className={`px-3 py-2 text-sm font-bold ${
                    lead.status === "GAGNE" ? "bg-green-light/60 text-[#245a27]" : "bg-orange-accent/12 text-orange-deep"
                  }`}
                >
                  {STATUS_LABEL[lead.status]}
                  {lead.lostReason ? ` — ${lead.lostReason}` : ""}
                </span>
                <button onClick={() => run(() => crmApi.reopen(lead.id), "Lead rouvert.")} className="btn btn-ghost-dark">
                  <RotateCcw size={16} /> Rouvrir
                </button>
              </>
            )}
            {isAdmin && (
              <button onClick={remove} className="p-2.5 text-gray-main transition-colors hover:text-orange-accent" aria-label="Supprimer le lead">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Barre d'étapes façon Odoo : cliquer sur une étape déplace le lead */}
        <ol className="mt-6 flex overflow-x-auto" data-lenis-prevent aria-label="Étapes du parcours d'incubation">
          {LEAD_STAGES.map((stage, i) => {
            const reached = i <= currentIndex && !closed;
            const current = i === currentIndex && !closed;
            return (
              <li key={stage} className="min-w-[120px] flex-1">
                <button
                  type="button"
                  disabled={closed}
                  aria-current={current ? "step" : undefined}
                  onClick={() => stage !== lead.stage && run(() => crmApi.patch(lead.id, { stage }), `Lead déplacé : ${STAGE_META[stage].short}.`)}
                  className={`relative h-11 w-full px-5 text-[0.8rem] font-bold transition-colors disabled:cursor-not-allowed ${
                    current
                      ? "bg-violet-dark text-white"
                      : reached
                        ? "bg-violet-mid/85 text-white"
                        : "bg-paper-deep text-gray-main hover:bg-violet-soft hover:text-violet-dark"
                  } ${closed ? "opacity-60" : ""}`}
                  style={{
                    clipPath:
                      i === 0
                        ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
                        : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)",
                    marginLeft: i === 0 ? 0 : -6,
                  }}
                >
                  {STAGE_META[stage].short}
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div aria-live="polite" className="px-6 pt-3 lg:px-8">
        {notice && (
          <p
            role={notice.tone === "error" ? "alert" : "status"}
            className={`border px-4 py-2.5 text-sm font-semibold ${
              notice.tone === "error" ? "border-orange-accent/40 bg-orange-accent/10 text-orange-deep" : "border-green-main/40 bg-green-light/40 text-[#245a27]"
            }`}
          >
            {notice.text}
          </p>
        )}
      </div>

      <div className="grid flex-1 gap-8 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:px-8">
        {/* Informations */}
        <form onSubmit={saveInfo} className="h-fit border border-line bg-white p-6">
          <h2 className="font-serif text-xl font-bold text-violet-dark">Informations</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Intitulé" full>
              <input name="title" defaultValue={lead.title} required className="field" />
            </Field>
            <Field label="Contact">
              <input name="contactName" defaultValue={lead.contactName} required className="field" />
            </Field>
            <Field label="Organisation / projet">
              <input name="companyName" defaultValue={lead.companyName ?? ""} className="field" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" defaultValue={lead.email ?? ""} className="field" />
            </Field>
            <Field label="Téléphone">
              <input name="phone" type="tel" defaultValue={lead.phone ?? ""} className="field" />
            </Field>
            <Field label="Profil">
              <select name="type" defaultValue={lead.type} className="field">
                {(Object.keys(TYPE_LABEL) as LeadType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                ))}
              </select>
            </Field>
            <Field label="Origine">
              <select name="source" defaultValue={lead.source} className="field">
                {(Object.keys(SOURCE_LABEL) as LeadSource[]).map((s) => (
                  <option key={s} value={s}>{SOURCE_LABEL[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="Responsable">
              <select name="assignedToId" defaultValue={lead.assignedToId ?? ""} className="field">
                <option value="">Non assigné</option>
                {staff.map((m) => (
                  <option key={m.id} value={m.id}>{staffName(m)}</option>
                ))}
              </select>
            </Field>
            <Field label="Score d'adéquation (0–100)">
              <input name="score" type="number" min={0} max={100} defaultValue={lead.score ?? ""} className="field" />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-bold text-violet-dark">Priorité</span>
              <div className="flex h-[2.9rem] items-center">
                <PriorityStars value={priority} onChange={setPriority} size={22} />
              </div>
            </div>
            <Field label="Notes" full>
              <textarea name="message" rows={4} defaultValue={lead.message ?? ""} className="field resize-y" />
            </Field>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-main">
              Probabilité actuelle : <strong className="tabular text-violet-dark">{lead.probability} %</strong>
            </p>
            <button type="submit" disabled={saving} className="btn btn-violet disabled:opacity-60">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>

        {/* Journal */}
        <section aria-labelledby="journal" className="min-w-0">
          <h2 id="journal" className="font-serif text-xl font-bold text-violet-dark">Journal & activités</h2>

          <form onSubmit={post} className="mt-4 border border-line bg-white">
            <div className="flex flex-wrap border-b border-line" role="tablist" aria-label="Type d'entrée">
              {COMPOSER_TYPES.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={actType === id}
                  onClick={() => setActType(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${
                    actType === id ? "bg-violet-dark text-white" : "text-gray-main hover:bg-paper hover:text-violet-dark"
                  }`}
                >
                  <Icon size={15} /> {ACTIVITY_LABEL[id]}
                </button>
              ))}
            </div>
            <div className="p-4">
              <label className="sr-only" htmlFor="act-content">Contenu</label>
              <textarea
                id="act-content"
                value={actContent}
                onChange={(e) => setActContent(e.target.value)}
                rows={3}
                placeholder={
                  actType === "NOTE" ? "Ajoutez une note au journal…" : `Décrivez ${actType === "REUNION" ? "le rendez-vous" : "l'échange"}…`
                }
                className="field resize-y"
              />
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <label className="text-sm font-semibold text-gray-main">
                  Planifier pour le (facultatif)
                  <input
                    type="datetime-local"
                    value={actDue}
                    onChange={(e) => setActDue(e.target.value)}
                    className="field mt-1 !w-auto !py-2"
                  />
                </label>
                <button type="submit" disabled={posting || !actContent.trim()} className="btn btn-primary !py-3 disabled:opacity-50">
                  {actDue ? "Planifier" : "Ajouter au journal"}
                </button>
              </div>
            </div>
          </form>

          <ul className="mt-6 space-y-0">
            {lead.activities.length === 0 && <li className="text-sm text-gray-main">Aucune entrée pour le moment.</li>}
            {lead.activities.map((a) => (
              <ActivityRow key={a.id} activity={a} onDone={() => run(() => crmApi.completeActivity(a.id), "Activité terminée.")} onDelete={() => run(() => crmApi.deleteActivity(a.id), "Entrée supprimée.")} />
            ))}
          </ul>
        </section>
      </div>

      <LostDialog
        open={showLost}
        leadTitle={lead.title}
        onCancel={() => setShowLost(false)}
        onConfirm={(reason) => {
          setShowLost(false);
          void run(() => crmApi.lose(lead.id, reason), "Lead marqué comme perdu.");
        }}
      />
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-bold text-violet-dark">{label}</span>
      {children}
    </label>
  );
}

function ActivityRow({
  activity,
  onDone,
  onDelete,
}: {
  activity: LeadActivity;
  onDone: () => void;
  onDelete: () => void;
}) {
  const Icon = ACTIVITY_ICON[activity.type];
  const system = activity.type === "SYSTEME";
  const planned = !!activity.dueAt && !activity.doneAt;
  const urgency = planned ? urgencyOf(activity.dueAt) : "none";

  return (
    <li className="relative flex gap-4 pb-6 pl-1 before:absolute before:bottom-0 before:left-[1.1rem] before:top-9 before:w-px before:bg-line last:before:hidden">
      <span
        className={`z-[1] flex h-8 w-8 shrink-0 items-center justify-center hex ${
          system ? "bg-paper-deep text-gray-main" : planned ? (urgency === "overdue" ? "bg-orange-accent text-white" : "bg-violet-main text-white") : "bg-violet-dark text-white"
        }`}
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[0.8rem] text-gray-main">
          <span className="font-bold text-violet-dark">{system ? "Système" : ACTIVITY_LABEL[activity.type]}</span>
          <span>{activity.author ? staffName(activity.author) : "Formulaire du site"}</span>
          <time dateTime={activity.createdAt} className="tabular">{formatDate(activity.createdAt, true)}</time>
        </div>
        <p className={`mt-1 whitespace-pre-wrap break-words ${system ? "text-[0.88rem] text-gray-main" : "text-ink"}`}>{activity.content}</p>
        {planned && (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold ${urgency === "overdue" ? "bg-orange-accent/12 text-orange-deep" : "bg-violet-soft text-violet-dark"}`}>
              <CalendarClock size={13} />
              {urgency === "overdue" ? "En retard · " : "Prévu · "}
              {formatDate(activity.dueAt, true)}
            </span>
            <button onClick={onDone} className="inline-flex items-center gap-1.5 text-xs font-bold text-green-main hover:underline">
              <Check size={14} /> Marquer comme fait
            </button>
          </div>
        )}
        {!planned && activity.dueAt && activity.doneAt && (
          <p className="mt-1 text-xs font-semibold text-green-main">Fait le {formatDate(activity.doneAt, true)}</p>
        )}
        {!system && (
          <button onClick={onDelete} className="mt-1 text-xs font-semibold text-gray-main/80 hover:text-orange-accent">
            Supprimer
          </button>
        )}
      </div>
    </li>
  );
}
