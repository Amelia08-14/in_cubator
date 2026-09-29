"use client";

import Link from "next/link";

import {
  SOURCE_LABEL,
  STAGE_META,
  STATUS_LABEL,
  TYPE_LABEL,
  formatDate,
  staffName,
  urgencyOf,
  type Lead,
} from "@/lib/crm/types";
import { PriorityStars } from "./LeadCard";

const STATUS_STYLE = {
  OUVERT: "bg-blue-main/10 text-blue-deep",
  GAGNE: "bg-green-light/60 text-[#245a27]",
  PERDU: "bg-orange-accent/12 text-orange-deep",
} as const;

export default function LeadList({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <p className="border border-dashed border-line bg-white px-6 py-14 text-center text-gray-main">
        Aucun lead ne correspond à ces filtres.
      </p>
    );
  }

  return (
    <div data-lenis-prevent className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="border-b border-line bg-paper text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">
          <tr>
            <th scope="col" className="px-4 py-3">Lead</th>
            <th scope="col" className="px-4 py-3">Contact</th>
            <th scope="col" className="px-4 py-3">Profil</th>
            <th scope="col" className="px-4 py-3">Étape</th>
            <th scope="col" className="px-4 py-3">Priorité</th>
            <th scope="col" className="px-4 py-3">Responsable</th>
            <th scope="col" className="px-4 py-3">Prochaine activité</th>
            <th scope="col" className="px-4 py-3">Créé le</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((lead) => {
            const urgency = urgencyOf(lead.nextActivityAt);
            const meta = STAGE_META[lead.stage];
            return (
              <tr key={lead.id} className="transition-colors hover:bg-paper/70">
                <td className="max-w-[280px] px-4 py-3.5">
                  <Link href={`/admin/crm/${lead.id}`} className="font-bold text-violet-dark hover:text-orange-deep">
                    {lead.title}
                  </Link>
                  <p className="tabular mt-0.5 text-xs text-gray-main">
                    {lead.reference} · {SOURCE_LABEL[lead.source]}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-ink">{lead.contactName}</p>
                  <p className="text-xs text-gray-main">{lead.email ?? lead.phone ?? "—"}</p>
                </td>
                <td className="px-4 py-3.5">{TYPE_LABEL[lead.type]}</td>
                <td className="px-4 py-3.5">
                  {lead.status === "OUVERT" ? (
                    <span className="inline-flex items-center gap-2 font-semibold text-violet-dark">
                      <span className="h-2.5 w-2.5" style={{ background: meta.color }} aria-hidden />
                      {meta.short}
                    </span>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-bold ${STATUS_STYLE[lead.status]}`}>
                      {STATUS_LABEL[lead.status]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <PriorityStars value={lead.priority} />
                </td>
                <td className="px-4 py-3.5 text-gray-main">{staffName(lead.assignedTo)}</td>
                <td className={`px-4 py-3.5 tabular ${urgency === "overdue" ? "font-bold text-orange-deep" : "text-gray-main"}`}>
                  {lead.nextActivityAt ? formatDate(lead.nextActivityAt) : "—"}
                </td>
                <td className="tabular px-4 py-3.5 text-gray-main">{formatDate(lead.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
