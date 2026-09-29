import { CalendarRange, TrendingUp, Users } from "lucide-react";

import { formatDate } from "@/lib/crm/types";
import type { CohortOverview } from "@/lib/cohorts/types";

// Trois indicateurs de la cohorte, séparés par des filets.
export default function AdminCohorteHeader({ overview }: { overview: CohortOverview }) {
  const { cohort } = overview;

  return (
    <dl className="mb-6 grid grid-cols-1 divide-y divide-line border border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="flex items-start gap-4 px-6 py-5">
        <Users size={20} className="mt-1 shrink-0 text-violet-main" />
        <div>
          <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">Startups actives</dt>
          <dd className="tabular mt-1 font-serif text-[2rem] font-extrabold leading-none text-violet-dark">
            {overview.activeCount}
          </dd>
          <p className="mt-1.5 text-sm text-gray-main">
            {overview.pendingCount > 0
              ? `${overview.pendingCount} candidature${overview.pendingCount > 1 ? "s" : ""} en cours d'examen`
              : "Candidatures acceptées"}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 px-6 py-5">
        <TrendingUp size={20} className="mt-1 shrink-0 text-violet-main" />
        <div className="min-w-0 flex-1">
          <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">Progression moyenne</dt>
          <dd className="tabular mt-1 font-serif text-[2rem] font-extrabold leading-none text-violet-dark">
            {overview.averageProgress}&nbsp;%
          </dd>
          <div className="mt-2.5 h-2 bg-paper-deep" role="presentation">
            <div className="h-full bg-orange-accent transition-[width] duration-700" style={{ width: `${overview.averageProgress}%` }} />
          </div>
          <p className="mt-1.5 text-sm text-gray-main">Tâches terminées dans les roadmaps</p>
        </div>
      </div>

      <div className="flex items-start gap-4 px-6 py-5">
        <CalendarRange size={20} className="mt-1 shrink-0 text-violet-main" />
        <div>
          <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">Période</dt>
          <dd className="mt-1 font-serif text-xl font-bold leading-tight text-violet-dark">
            {formatDate(cohort.dateDebut)}
            <span className="block text-gray-main">→ {formatDate(cohort.dateFin)}</span>
          </dd>
        </div>
      </div>
    </dl>
  );
}
