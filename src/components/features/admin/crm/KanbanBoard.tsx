"use client";

import { useState } from "react";
import { Plus, Trophy, XCircle } from "lucide-react";

import { LEAD_STAGES, STAGE_META, type Lead, type LeadStage } from "@/lib/crm/types";
import LeadCard from "./LeadCard";

type Props = {
  leads: Lead[];
  onMove: (id: string, stage: LeadStage) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onPriority: (id: string, priority: number) => void;
  onQuickAdd: (stage: LeadStage) => void;
};

export default function KanbanBoard({ leads, onMove, onWin, onLose, onPriority, onQuickAdd }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  const open = leads.filter((l) => l.status === "OUVERT");

  function drop(target: LeadStage | "WIN" | "LOSE", event: React.DragEvent) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") || dragId;
    setOverKey(null);
    setDragId(null);
    if (!id) return;
    if (target === "WIN") onWin(id);
    else if (target === "LOSE") onLose(id);
    else onMove(id, target);
  }

  function dropProps(key: LeadStage | "WIN" | "LOSE") {
    return {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (overKey !== key) setOverKey(key);
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setOverKey(null);
      },
      onDrop: (e: React.DragEvent) => drop(key, e),
    };
  }

  function keyMove(id: string, direction: -1 | 1) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const index = LEAD_STAGES.indexOf(lead.stage) + direction;
    const next = LEAD_STAGES[index];
    if (next) onMove(id, next);
  }

  return (
    <>
    <div data-lenis-prevent className="overflow-x-auto pb-4">
      <div className="flex min-w-max items-start gap-3">
        {LEAD_STAGES.map((stage) => {
          const meta = STAGE_META[stage];
          const items = open.filter((l) => l.stage === stage);
          const active = overKey === stage;

          return (
            <section
              key={stage}
              aria-label={`${meta.label} — ${items.length} lead(s)`}
              {...dropProps(stage)}
              className={`flex w-[268px] shrink-0 flex-col bg-paper-deep/55 transition-colors ${
                active ? "bg-violet-soft/70 outline outline-2 -outline-offset-2 outline-violet-main" : ""
              }`}
            >
              <header className="border-t-[3px] px-3.5 pb-2.5 pt-3" style={{ borderTopColor: meta.color }}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[0.86rem] font-bold leading-tight text-violet-dark">{meta.short}</h3>
                  <button
                    type="button"
                    onClick={() => onQuickAdd(stage)}
                    aria-label={`Ajouter un lead à l'étape ${meta.short}`}
                    className="-mr-1 -mt-0.5 p-1 text-gray-main transition-colors hover:bg-white hover:text-orange-accent"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="mt-1 text-[0.72rem] font-semibold text-gray-main tabular">
                  {items.length} lead{items.length > 1 ? "s" : ""} · {meta.probability}&nbsp;% de probabilité
                </p>
              </header>

              <ul className="flex min-h-[120px] flex-col gap-2.5 px-2.5 pb-3">
                {items.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    dragging={dragId === lead.id}
                    onDragStart={setDragId}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverKey(null);
                    }}
                    onPriority={onPriority}
                    onKeyMove={keyMove}
                  />
                ))}
                {items.length === 0 && (
                  <li className="border border-dashed border-line px-3 py-6 text-center text-[0.8rem] text-gray-main">
                    Déposez un lead ici
                  </li>
                )}
              </ul>
            </section>
          );
        })}

      </div>
    </div>

    {/* Issues du pipeline : la barre n'apparaît que pendant un glisser-déposer */}
    {dragId && (
      <div
        role="group"
        aria-label="Clôturer le lead"
        className="fixed bottom-6 left-1/2 z-40 flex w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 gap-3 lg:left-[calc(50%+8.5rem)]"
      >
        <div
          {...dropProps("WIN")}
          className={`flex flex-1 items-center justify-center gap-3 border-2 border-dashed px-4 py-5 text-[#245a27] shadow-deep transition-colors ${
            overKey === "WIN" ? "border-green-main bg-green-light" : "border-green-main/60 bg-white"
          }`}
        >
          <Trophy size={22} />
          <span className="text-sm font-bold">Gagné</span>
        </div>
        <div
          {...dropProps("LOSE")}
          className={`flex flex-1 items-center justify-center gap-3 border-2 border-dashed px-4 py-5 text-orange-deep shadow-deep transition-colors ${
            overKey === "LOSE" ? "border-orange-accent bg-[#f7ddd8]" : "border-orange-accent/60 bg-white"
          }`}
        >
          <XCircle size={22} />
          <span className="text-sm font-bold">Perdu</span>
        </div>
      </div>
    )}
    </>
  );
}
