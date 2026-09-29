"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";

import { STAGE_LABEL, type CohortStartupRow } from "@/lib/cohorts/types";
import { formatDate } from "@/lib/crm/types";

type SortKey = "name" | "progress";

export default function AdminCohorteTable({ startups }: { startups: CohortStartupRow[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("progress");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? startups.filter((s) => [s.name, s.founder, s.sector].some((v) => v.toLowerCase().includes(q)))
      : startups;
    return [...filtered].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name, "fr") : b.progress - a.progress));
  }, [startups, query, sort]);

  return (
    <section aria-labelledby="cohorte-startups" className="border border-line bg-white">
      <header className="flex flex-col gap-4 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="cohorte-startups" className="font-serif text-xl font-bold text-violet-dark">
          Startups actives <span className="tabular ml-2 bg-violet-soft px-2 py-0.5 font-sans text-xs font-bold text-violet-dark">{startups.length}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative">
            <span className="sr-only">Rechercher une startup</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-main" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="field !w-56 !py-2 !pl-9 text-sm"
            />
          </label>
          <label>
            <span className="sr-only">Trier par</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="field !w-auto !py-2 text-sm font-semibold">
              <option value="progress">Trier par progression</option>
              <option value="name">Trier par nom</option>
            </select>
          </label>
        </div>
      </header>

      {startups.length === 0 ? (
        <p className="px-6 py-14 text-center text-gray-main">
          Aucune startup active pour l&apos;instant. Elles apparaissent ici dès que leur candidature est acceptée.
        </p>
      ) : rows.length === 0 ? (
        <p className="px-6 py-14 text-center text-gray-main">Aucune startup ne correspond à cette recherche.</p>
      ) : (
        <div data-lenis-prevent className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">
              <tr>
                <th scope="col" className="px-6 py-3">Startup et porteur</th>
                <th scope="col" className="px-4 py-3">Secteur</th>
                <th scope="col" className="px-4 py-3">Stade</th>
                <th scope="col" className="px-4 py-3">Progression</th>
                <th scope="col" className="px-4 py-3">Dernier rendez-vous</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Ouvrir</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-paper/70">
                  <td className="px-6 py-4">
                    <p className="font-bold text-violet-dark">{s.name}</p>
                    <p className="text-xs text-gray-main">{s.founder}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="border border-violet-dark/25 px-2 py-0.5 text-xs font-bold text-violet-dark">{s.sector}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-main">{STAGE_LABEL[s.stage] ?? s.stage}</td>
                  <td className="px-4 py-4">
                    {s.hasRoadmap ? (
                      <div className="w-44">
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="tabular font-bold text-ink">{s.progress}&nbsp;%</span>
                          <span className="tabular text-gray-main">{s.doneTasks}/{s.totalTasks} tâches</span>
                        </div>
                        <div className="mt-1.5 h-2 bg-paper-deep" role="presentation">
                          <div className="h-full bg-orange-accent" style={{ width: `${s.progress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-main">Roadmap à créer</span>
                    )}
                  </td>
                  <td className="tabular px-4 py-4 text-gray-main">{s.lastMeeting ? formatDate(s.lastMeeting) : "—"}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/startups/${s.id}`}
                      aria-label={`Ouvrir la fiche de ${s.name}`}
                      className="inline-flex p-2 text-gray-main transition-colors hover:text-orange-deep"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
