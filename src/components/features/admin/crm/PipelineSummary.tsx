import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CrmStats } from "@/lib/crm/types";
import { Funnel, UpcomingActivities } from "./CrmInsights";

// Bloc « Pipeline » du tableau de bord : entonnoir + activités à venir.
export default function PipelineSummary({ stats }: { stats: CrmStats }) {
  const conversion = stats.conversionRate === null ? "—" : `${stats.conversionRate} %`;

  return (
    <section aria-labelledby="pipeline-title" className="mb-8 border border-line bg-white">
      <header className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="pipeline-title" className="font-serif text-xl font-bold text-violet-dark">
            Pipeline d&apos;incubation
          </h2>
          <p className="mt-1 text-sm text-gray-main">
            <span className="tabular font-bold text-violet-dark">{stats.totals.open}</span> leads ouverts ·{" "}
            <span className="tabular font-bold text-violet-dark">{stats.created30}</span> nouveaux en 30 jours · conversion{" "}
            <span className="tabular font-bold text-violet-dark">{conversion}</span>
            {stats.overdueActivities > 0 && (
              <>
                {" "}
                · <span className="font-bold text-orange-deep">{stats.overdueActivities} activité{stats.overdueActivities > 1 ? "s" : ""} en retard</span>
              </>
            )}
          </p>
        </div>
        <Link href="/admin/crm" className="btn btn-violet !py-3 self-start sm:self-auto">
          Ouvrir le CRM <ArrowRight size={16} />
        </Link>
      </header>

      <div className="grid gap-x-12 gap-y-8 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h3 className="mb-4 text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">Leads par étape</h3>
          <Funnel stats={stats} />
        </div>
        <div>
          <h3 className="mb-1 text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">À faire prochainement</h3>
          <UpcomingActivities stats={stats} />
        </div>
      </div>
    </section>
  );
}
