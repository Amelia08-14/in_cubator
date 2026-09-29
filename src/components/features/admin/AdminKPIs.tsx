import React from "react";
import Link from "next/link";

interface AdminKPIsProps {
  candidaturesCount: number;
  startupsCount: number;
  mentorsCount: number;
  openLeads?: number | null;
}

export default function AdminKPIs({ candidaturesCount, startupsCount, mentorsCount, openLeads }: AdminKPIsProps) {
  const kpis = [
    { title: "Candidatures à évaluer", value: candidaturesCount, hint: "En attente de décision", href: "/admin/candidatures", accent: "#d44835" },
    { title: "Startups sur la plateforme", value: startupsCount, hint: "Profils créés", href: "/admin/startups", accent: "#964594" },
    { title: "Mentors actifs", value: mentorsCount, hint: "Disponibles pour des sessions", href: "/admin/mentors", accent: "#1f5aa6" },
    ...(openLeads != null
      ? [{ title: "Leads ouverts", value: openLeads, hint: "Dans le pipeline CRM", href: "/admin/crm", accent: "#3e2a57" }]
      : []),
  ];

  return (
    <dl className="mb-8 grid grid-cols-1 border border-line bg-white sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
      {kpis.map((kpi) => (
        <Link
          key={kpi.title}
          href={kpi.href}
          className="group relative block border-b border-line px-6 py-5 transition-colors hover:bg-paper/70 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0"
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-[0.28] transition-transform duration-500 group-hover:scale-x-100" style={{ background: kpi.accent }} />
          <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-gray-main">{kpi.title}</dt>
          <dd className="tabular mt-2 font-serif text-[2.2rem] font-extrabold leading-none text-violet-dark">{kpi.value}</dd>
          <p className="mt-2 text-sm text-gray-main">{kpi.hint}</p>
        </Link>
      ))}
    </dl>
  );
}
