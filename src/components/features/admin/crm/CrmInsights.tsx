import Link from "next/link";
import { CalendarClock } from "lucide-react";

import {
  ACTIVITY_LABEL,
  SOURCE_LABEL,
  STAGE_META,
  TYPE_LABEL,
  formatDate,
  urgencyOf,
  type CrmStats,
} from "@/lib/crm/types";

function Bars({
  rows,
  colorFor,
}: {
  rows: { key: string; label: string; count: number; color?: string }[];
  colorFor?: (key: string) => string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold text-violet-dark">{r.label}</span>
            <span className="tabular font-bold text-ink">{r.count}</span>
          </div>
          <div className="mt-1.5 h-2 bg-paper-deep" role="presentation">
            <div
              className="h-full transition-[width] duration-700"
              style={{ width: `${(r.count / max) * 100}%`, background: r.color ?? colorFor?.(r.key) ?? "#3e2a57" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Funnel({ stats }: { stats: CrmStats }) {
  return (
    <Bars
      rows={stats.byStage.map((s) => ({
        key: s.stage,
        label: `${STAGE_META[s.stage].short} · ${s.probability} %`,
        count: s.count,
        color: STAGE_META[s.stage].color,
      }))}
    />
  );
}

export function WeeklyBars({ stats }: { stats: CrmStats }) {
  const max = Math.max(1, ...stats.weekly.map((w) => w.count));
  return (
    <div>
      <div className="flex h-32 items-end gap-2" role="img" aria-label="Nouveaux leads par semaine sur huit semaines">
        {stats.weekly.map((w) => (
          <div key={w.weekStart} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="tabular text-xs font-bold text-violet-dark">{w.count || ""}</span>
            <div
              className="w-full bg-violet-main"
              style={{ height: w.count ? Math.max(Math.round((w.count / max) * 96), 8) : 3, opacity: w.count ? 1 : 0.25 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[0.7rem] font-semibold text-gray-main">
        <span>Il y a 8 sem.</span>
        <span>Cette semaine</span>
      </div>
    </div>
  );
}

export function UpcomingActivities({ stats }: { stats: CrmStats }) {
  if (stats.upcoming.length === 0) {
    return <p className="text-sm text-gray-main">Aucune activité planifiée. Planifiez un appel depuis la fiche d&apos;un lead.</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {stats.upcoming.map((a) => {
        const urgency = urgencyOf(a.dueAt);
        return (
          <li key={a.id}>
            <Link href={`/admin/crm/${a.lead.id}`} className="flex items-start gap-3 py-3 transition-colors hover:bg-paper/70">
              <CalendarClock
                size={17}
                className={`mt-0.5 shrink-0 ${urgency === "overdue" ? "text-orange-accent" : "text-violet-main"}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-violet-dark">{a.lead.title}</p>
                <p className="truncate text-[0.82rem] text-gray-main">
                  {ACTIVITY_LABEL[a.type]} · {a.content}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-bold ${
                  urgency === "overdue" ? "text-orange-deep" : "text-gray-main"
                }`}
              >
                {urgency === "overdue" ? "En retard · " : ""}
                {formatDate(a.dueAt)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function CrmInsights({ stats }: { stats: CrmStats }) {
  const sources = stats.bySource
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((s) => ({ key: s.source, label: SOURCE_LABEL[s.source], count: s.count }));
  const types = stats.byType
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((t) => ({ key: t.type, label: TYPE_LABEL[t.type], count: t.count }));

  return (
    <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
      <section aria-labelledby="ins-funnel">
        <h3 id="ins-funnel" className="font-serif text-xl font-bold text-violet-dark">
          Entonnoir d&apos;incubation
        </h3>
        <p className="mb-5 mt-1 text-sm text-gray-main">Leads ouverts par étape du parcours.</p>
        <Funnel stats={stats} />
      </section>

      <section aria-labelledby="ins-weekly">
        <h3 id="ins-weekly" className="font-serif text-xl font-bold text-violet-dark">
          Nouveaux leads
        </h3>
        <p className="mb-5 mt-1 text-sm text-gray-main">Arrivées par semaine, sur les huit dernières semaines.</p>
        <WeeklyBars stats={stats} />
      </section>

      <section aria-labelledby="ins-sources">
        <h3 id="ins-sources" className="font-serif text-xl font-bold text-violet-dark">
          Origine des leads
        </h3>
        <p className="mb-5 mt-1 text-sm text-gray-main">D&apos;où viennent vos contacts.</p>
        {sources.length ? <Bars rows={sources} colorFor={() => "#964594"} /> : <p className="text-sm text-gray-main">Pas encore de données.</p>}
      </section>

      <section aria-labelledby="ins-types">
        <h3 id="ins-types" className="font-serif text-xl font-bold text-violet-dark">
          Profils
        </h3>
        <p className="mb-5 mt-1 text-sm text-gray-main">Startups, investisseurs, partenaires, mentors, diaspora.</p>
        {types.length ? <Bars rows={types} colorFor={() => "#1f5aa6"} /> : <p className="text-sm text-gray-main">Pas encore de données.</p>}
      </section>

      <section aria-labelledby="ins-upcoming" className="lg:col-span-2">
        <h3 id="ins-upcoming" className="font-serif text-xl font-bold text-violet-dark">
          Activités à venir
        </h3>
        <div className="mt-3">
          <UpcomingActivities stats={stats} />
        </div>
      </section>
    </div>
  );
}
