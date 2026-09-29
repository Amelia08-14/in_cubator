import Link from "next/link";
import { AlertTriangle, Trophy } from "lucide-react";

import type { CohortRank } from "@/lib/cohorts/types";

function RankList({
  rows,
  tone,
  empty,
}: {
  rows: CohortRank[];
  tone: "top" | "low";
  empty: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-gray-main">{empty}</p>;

  return (
    <ol className="space-y-4">
      {rows.map((row, i) => (
        <li key={row.id}>
          <div className="flex items-baseline justify-between gap-3">
            <Link
              href={`/admin/startups/${row.id}`}
              className="flex items-center gap-3 font-bold text-violet-dark transition-colors hover:text-orange-deep"
            >
              <span
                className={`hex flex h-7 w-7 items-center justify-center text-xs font-bold text-white ${
                  tone === "top" ? "bg-violet-dark" : "bg-orange-accent"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
              {row.name}
            </Link>
            <span className="tabular text-sm font-bold text-ink">{row.progress}&nbsp;%</span>
          </div>
          <div className="mt-2 h-2 bg-paper-deep" role="presentation">
            <div
              className={`h-full transition-[width] duration-700 ${tone === "top" ? "bg-violet-dark" : "bg-orange-accent"}`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AdminCohorteLeaderboard({ top3, bottom3 }: { top3: CohortRank[]; bottom3: CohortRank[] }) {
  return (
    <section aria-labelledby="cohorte-classement" className="mb-6 border border-line bg-white">
      <header className="border-b border-line px-6 py-5">
        <h2 id="cohorte-classement" className="font-serif text-xl font-bold text-violet-dark">
          Progression des startups
        </h2>
        <p className="mt-1 text-sm text-gray-main">
          Classement selon le taux de tâches terminées dans la roadmap de chaque startup.
        </p>
      </header>

      <div className="grid gap-x-14 gap-y-8 px-6 py-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-5 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">
            <Trophy size={15} className="text-violet-main" /> Les plus avancées
          </h3>
          <RankList rows={top3} tone="top" empty="Aucune roadmap n'est encore renseignée dans cette cohorte." />
        </div>
        <div>
          <h3 className="mb-5 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">
            <AlertTriangle size={15} className="text-orange-accent" /> À accompagner en priorité
          </h3>
          <RankList
            rows={bottom3}
            tone="low"
            empty="Affiché dès que la cohorte compte plus de trois startups avec une roadmap."
          />
        </div>
      </div>
    </section>
  );
}
