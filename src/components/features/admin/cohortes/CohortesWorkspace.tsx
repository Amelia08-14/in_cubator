"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileDown, Pencil, Plus } from "lucide-react";

import { ClientApiError } from "@/lib/api-client-v2";
import { cohortsApi } from "@/lib/cohorts/api";
import {
  COHORT_NEXT,
  COHORT_STATUS_LABEL,
  COHORT_STATUS_STYLE,
  STAGE_LABEL,
  type Cohort,
  type CohortOverview,
} from "@/lib/cohorts/types";
import { formatDate } from "@/lib/crm/types";
import AdminCohorteHeader from "./AdminCohorteHeader";
import AdminCohorteLeaderboard from "./AdminCohorteLeaderboard";
import AdminCohorteTable from "./AdminCohorteTable";
import CohorteFormPanel from "./CohorteFormPanel";

const csvCell = (value: string | number | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;

// Export du suivi : CSV avec séparateur « ; » et BOM pour une ouverture directe dans Excel.
function downloadCsv(overview: CohortOverview) {
  const head = ["Startup", "Porteur", "Secteur", "Stade", "Progression (%)", "Tâches terminées", "Tâches totales", "Dernier rendez-vous"];
  const lines = overview.startups.map((s) =>
    [
      s.name,
      s.founder,
      s.sector,
      STAGE_LABEL[s.stage] ?? s.stage,
      s.progress,
      s.doneTasks,
      s.totalTasks,
      s.lastMeeting ? formatDate(s.lastMeeting) : "",
    ]
      .map(csvCell)
      .join(";"),
  );
  const blob = new Blob(["﻿" + [head.map(csvCell).join(";"), ...lines].join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `suivi-${overview.cohort.nom.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CohortesWorkspace({
  cohorts,
  overview,
}: {
  cohorts: Cohort[];
  overview: CohortOverview | null;
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<null | "create" | "edit">(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const openExists = cohorts.some((c) => c.statut === "OUVERTE_CANDIDATURES");
  const selected = overview?.cohort ?? null;
  const next = selected ? COHORT_NEXT[selected.statut] : undefined;

  const say = (tone: "ok" | "error", text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice(null), 5000);
  };

  async function advance() {
    if (!selected || !next) return;
    if (!window.confirm(`${next.label} « ${selected.nom} » ?\n\n${next.hint}`)) return;
    setBusy(true);
    try {
      await cohortsApi.patch(selected.id, { statut: next.to });
      say("ok", `« ${selected.nom} » : ${COHORT_STATUS_LABEL[next.to].toLowerCase()}.`);
      router.refresh();
    } catch (e) {
      say("error", e instanceof ClientApiError ? e.message : "Le statut n'a pas pu être modifié.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <header className="border-b border-line bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-serif text-[1.7rem] font-extrabold leading-tight text-violet-dark">Cohortes</h1>
            <p className="mt-1 text-sm text-gray-main">
              Suivez la progression de chaque promotion et intervenez auprès des startups qui en ont besoin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {overview && (
              <button type="button" onClick={() => downloadCsv(overview)} className="btn btn-ghost-dark !py-3">
                <FileDown size={16} /> Exporter le suivi (CSV)
              </button>
            )}
            <button type="button" onClick={() => setPanel("create")} className="btn btn-primary !py-3">
              <Plus size={17} /> Nouvelle cohorte
            </button>
          </div>
        </div>

        {selected && (
          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label>
                <span className="sr-only">Cohorte affichée</span>
                <select
                  value={selected.id}
                  onChange={(e) => router.push(`/admin/cohortes?cohorte=${e.target.value}`)}
                  className="field !w-auto !py-2.5 !pr-9 font-serif text-base font-bold"
                >
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </label>
              <span className={`px-2.5 py-1 text-xs font-bold ${COHORT_STATUS_STYLE[selected.statut]}`}>
                {COHORT_STATUS_LABEL[selected.statut]}
              </span>
              <span className="text-sm text-gray-main">
                {selected.candidaturesCount} candidature{selected.candidaturesCount > 1 ? "s" : ""} reçue
                {selected.candidaturesCount > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setPanel("edit")} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold text-violet-dark hover:text-orange-deep">
                <Pencil size={15} /> Modifier
              </button>
              {next && (
                <button type="button" onClick={advance} disabled={busy} className="btn btn-violet !py-3 disabled:opacity-60">
                  {next.label}
                </button>
              )}
            </div>
          </div>
        )}
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
        {overview ? (
          <>
            <AdminCohorteHeader overview={overview} />
            <AdminCohorteLeaderboard top3={overview.top3} bottom3={overview.bottom3} />
            <AdminCohorteTable startups={overview.startups} />
          </>
        ) : (
          <div className="facet-tr mx-auto max-w-2xl bg-white p-10 shadow-lift">
            <h2 className="font-serif text-3xl font-bold text-violet-dark">Créez votre première cohorte.</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-main">
              Une cohorte regroupe les startups d&apos;une même promotion. Tant qu&apos;aucune cohorte n&apos;a ses
              candidatures ouvertes, le site refuse les nouvelles candidatures.
            </p>
            <button type="button" onClick={() => setPanel("create")} className="btn btn-primary mt-8">
              <Plus size={17} /> Nouvelle cohorte
            </button>
          </div>
        )}
      </div>

      {panel && (
        <CohorteFormPanel
          cohort={panel === "edit" ? selected : null}
          openExists={openExists}
          onClose={() => setPanel(null)}
          onSaved={(cohort, created) => {
            say("ok", created ? `Cohorte « ${cohort.nom} » créée.` : "Modifications enregistrées.");
            if (created) router.push(`/admin/cohortes?cohorte=${cohort.id}`);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
