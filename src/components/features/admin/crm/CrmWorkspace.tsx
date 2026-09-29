"use client";

import { useCallback, useMemo, useState } from "react";
import { BarChart3, KanbanSquare, List, Plus, Search } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { crmApi } from "@/lib/crm/api";
import {
  SOURCE_LABEL,
  TYPE_LABEL,
  staffName,
  type CrmStats,
  type Lead,
  type LeadSource,
  type LeadStage,
  type LeadType,
  type StaffMember,
} from "@/lib/crm/types";
import CrmInsights from "./CrmInsights";
import KanbanBoard from "./KanbanBoard";
import LeadList from "./LeadList";
import LostDialog from "./LostDialog";
import NewLeadPanel from "./NewLeadPanel";

type View = "pipeline" | "liste" | "analyses";

const VIEWS: { id: View; label: string; icon: typeof KanbanSquare }[] = [
  { id: "pipeline", label: "Pipeline", icon: KanbanSquare },
  { id: "liste", label: "Liste", icon: List },
  { id: "analyses", label: "Analyses", icon: BarChart3 },
];

function sortLeads(a: Lead, b: Lead) {
  return b.priority - a.priority || +new Date(b.createdAt) - +new Date(a.createdAt);
}

export default function CrmWorkspace({
  initialLeads,
  initialStats,
  staff,
  currentUserId,
}: {
  initialLeads: Lead[];
  initialStats: CrmStats;
  staff: StaffMember[];
  currentUserId: string;
}) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [view, setView] = useState<View>("pipeline");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<LeadType | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [owner, setOwner] = useState<string>("");
  const [showClosed, setShowClosed] = useState(false);
  const [panel, setPanel] = useState<{ open: boolean; stage: LeadStage }>({ open: false, stage: "NOUVEAU" });
  const [lostFor, setLostFor] = useState<Lead | null>(null);
  const [now] = useState(() => Date.now());
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const say = useCallback((tone: "ok" | "error", text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice((n) => (n?.text === text ? null : n)), 4500);
  }, []);

  const replace = useCallback((next: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === next.id ? next : l)).sort(sortLeads));
  }, []);

  const failure = (e: unknown, fallback: string) =>
    say("error", e instanceof ClientApiError ? e.message : fallback);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (type && l.type !== type) return false;
      if (source && l.source !== source) return false;
      if (owner === "__none" && l.assignedToId) return false;
      if (owner && owner !== "__none" && l.assignedToId !== owner) return false;
      if (!q) return true;
      return [l.title, l.contactName, l.companyName, l.email, l.reference]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, query, type, source, owner]);

  // Métriques recalculées côté client pour rester justes après chaque action.
  const open = leads.filter((l) => l.status === "OUVERT");
  const won = leads.filter((l) => l.status === "GAGNE").length;
  const lost = leads.filter((l) => l.status === "PERDU").length;
  const overdue = open.filter((l) => l.nextActivityAt && new Date(l.nextActivityAt).getTime() < now).length;
  const created30 = leads.filter((l) => now - new Date(l.createdAt).getTime() < 30 * 86_400_000).length;
  const conversion = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : null;
  const weighted = open.reduce((sum, l) => sum + l.probability / 100, 0);

  async function move(id: string, stage: LeadStage) {
    const current = leads.find((l) => l.id === id);
    if (!current || current.stage === stage) return;
    replace({ ...current, stage, status: "OUVERT", probability: current.probability });
    try {
      replace(await crmApi.patch(id, { stage }));
    } catch (e) {
      replace(current);
      failure(e, "Le lead n'a pas pu être déplacé.");
    }
  }

  async function win(id: string) {
    const current = leads.find((l) => l.id === id);
    if (!current) return;
    replace({ ...current, status: "GAGNE", probability: 100 });
    try {
      replace(await crmApi.win(id));
      say("ok", `« ${current.title} » est marqué comme gagné.`);
    } catch (e) {
      replace(current);
      failure(e, "Le lead n'a pas pu être clôturé.");
    }
  }

  async function lose(reason: string) {
    if (!lostFor) return;
    const current = lostFor;
    setLostFor(null);
    replace({ ...current, status: "PERDU", probability: 0, lostReason: reason });
    try {
      replace(await crmApi.lose(current.id, reason));
      say("ok", `« ${current.title} » est marqué comme perdu.`);
    } catch (e) {
      replace(current);
      failure(e, "Le lead n'a pas pu être clôturé.");
    }
  }

  async function priority(id: string, value: number) {
    const current = leads.find((l) => l.id === id);
    if (!current || current.priority === value) return;
    replace({ ...current, priority: value });
    try {
      replace(await crmApi.patch(id, { priority: value }));
    } catch (e) {
      replace(current);
      failure(e, "La priorité n'a pas pu être modifiée.");
    }
  }

  const visibleForBoard = showClosed ? filtered : filtered.filter((l) => l.status === "OUVERT");
  const listRows = view === "liste" ? (showClosed ? filtered : filtered.filter((l) => l.status === "OUVERT")) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-[1.7rem] font-extrabold leading-tight text-violet-dark">CRM — Pipeline</h1>
            <p className="mt-1 text-sm text-gray-main">
              Suivez chaque contact, de la première prise de contact jusqu&apos;au lancement de son projet.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex border border-line bg-paper p-0.5" role="tablist" aria-label="Vue">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={view === v.id}
                  onClick={() => setView(v.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-bold transition-colors ${
                    view === v.id ? "bg-violet-dark text-white" : "text-gray-main hover:text-violet-dark"
                  }`}
                >
                  <v.icon size={16} />
                  {v.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setPanel({ open: true, stage: "NOUVEAU" })} className="btn btn-primary !py-3">
              <Plus size={17} /> Nouveau lead
            </button>
          </div>
        </div>

        {/* Indicateurs : une seule ligne, séparée par des filets */}
        <dl className="mt-5 grid grid-cols-2 gap-y-3 divide-x divide-line border border-line bg-paper/60 md:grid-cols-4">
          <Kpi label="Leads ouverts" value={String(open.length)} hint={`${weighted.toFixed(1).replace(".", ",")} conversions attendues`} />
          <Kpi label="Nouveaux (30 jours)" value={String(created30)} hint={deltaHint(created30, initialStats.created60)} />
          <Kpi label="Taux de conversion" value={conversion === null ? "—" : `${conversion} %`} hint={`${won} gagné${won > 1 ? "s" : ""} · ${lost} perdu${lost > 1 ? "s" : ""}`} />
          <Kpi label="Activités en retard" value={String(overdue)} hint={overdue > 0 ? "À traiter aujourd'hui" : "Tout est à jour"} tone={overdue > 0 ? "alert" : "ok"} />
        </dl>
      </header>

      {view !== "analyses" && (
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-white/60 px-6 py-3 lg:px-8">
          <label className="relative min-w-[220px] flex-1 md:max-w-sm">
            <span className="sr-only">Rechercher un lead</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-main" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un lead, un contact…"
              className="field !py-2.5 !pl-9"
            />
          </label>
          <div className="grid w-full grid-cols-2 gap-3 sm:contents">
            <Select label="Profil" value={type} onChange={(v) => setType(v as LeadType | "")} options={Object.entries(TYPE_LABEL)} />
            <Select label="Origine" value={source} onChange={(v) => setSource(v as LeadSource | "")} options={Object.entries(SOURCE_LABEL)} />
            <Select
              label="Responsable"
              value={owner}
              onChange={setOwner}
              options={[["__none", "Non assigné"], ...staff.map((m) => [m.id, staffName(m)] as [string, string])]}
            />
          </div>
          <button
            type="button"
            onClick={() => setOwner(owner === currentUserId ? "" : currentUserId)}
            aria-pressed={owner === currentUserId}
            className={`border px-3 py-2 text-sm font-bold transition-colors ${
              owner === currentUserId
                ? "border-violet-dark bg-violet-dark text-white"
                : "border-line bg-white text-violet-dark hover:border-violet-main"
            }`}
          >
            Mes leads
          </button>
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-main">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
              className="h-4 w-4 accent-[#3e2a57]"
            />
            Afficher gagnés et perdus
          </label>
        </div>
      )}

      <div aria-live="polite" className="px-6 pt-3 lg:px-8">
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

      <main className="flex-1 px-6 py-5 lg:px-8">
        {view === "pipeline" && (
          <>
            <KanbanBoard
              leads={visibleForBoard}
              onMove={move}
              onWin={win}
              onLose={(id) => setLostFor(leads.find((l) => l.id === id) ?? null)}
              onPriority={priority}
              onQuickAdd={(stage) => setPanel({ open: true, stage })}
            />
            <p className="mt-2 text-xs text-gray-main">
              Astuce : glissez un lead vers une autre colonne, ou utilisez Alt + ← / → sur une carte sélectionnée.
            </p>
          </>
        )}
        {view === "liste" && <LeadList leads={listRows} />}
        {view === "analyses" && <CrmInsights stats={initialStats} />}
      </main>

      <NewLeadPanel
        open={panel.open}
        initialStage={panel.stage}
        staff={staff}
        currentUserId={currentUserId}
        onClose={() => setPanel((p) => ({ ...p, open: false }))}
        onCreated={(lead) => {
          setLeads((prev) => [lead, ...prev].sort(sortLeads));
          say("ok", `Lead « ${lead.title} » créé (${lead.reference}).`);
        }}
      />
      <LostDialog open={!!lostFor} leadTitle={lostFor?.title ?? ""} onCancel={() => setLostFor(null)} onConfirm={lose} />
    </div>
  );
}

function deltaHint(now: number, before: number) {
  const diff = now - before;
  if (diff === 0) return "Stable vs. les 30 jours précédents";
  return `${diff > 0 ? "+" : "−"}${Math.abs(diff)} vs. les 30 jours précédents`;
}

function Kpi({
  label,
  value,
  hint,
  tone = "ok",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "ok" | "alert";
}) {
  return (
    <div className="px-5 py-3">
      <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">{label}</dt>
      <dd className={`tabular mt-1 font-serif text-[1.7rem] font-extrabold leading-none ${tone === "alert" ? "text-orange-accent" : "text-violet-dark"}`}>
        {value}
      </dd>
      <p className="mt-1.5 text-xs text-gray-main">{hint}</p>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][] | [string, string][];
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field !w-full !py-2.5 !pr-8 text-sm font-semibold sm:!w-auto">
        <option value="">{label} : tous</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
