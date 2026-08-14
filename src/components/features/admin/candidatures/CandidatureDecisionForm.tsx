"use client";

import React from "react";
import { ClipboardList, Check, Save, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { useState } from "react";

const decisionSchema = z.object({
  decision: z.enum(["Accepté", "Entretien éventuel", "Liste d'attente", "Refusé"], {
    required_error: "Veuillez sélectionner une décision.",
  }),
  motif: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.decision === "Refusé" && (!data.motif || data.motif.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Le motif de refus est obligatoire pour pouvoir enregistrer cette décision.",
      path: ["motif"],
    });
  }
});

type DecisionFormValues = z.infer<typeof decisionSchema>;

const statusMapToLabel: Record<string, DecisionFormValues["decision"]> = {
  ACCEPTEE: "Accepté",
  ENTRETIEN_PLANIFIE: "Entretien éventuel",
  LISTE_ATTENTE: "Liste d'attente",
  REFUSEE: "Refusé",
};

const labelMapToStatus: Record<DecisionFormValues["decision"], string> = {
  "Accepté": "ACCEPTEE",
  "Entretien éventuel": "ENTRETIEN_PLANIFIE",
  "Liste d'attente": "LISTE_ATTENTE",
  "Refusé": "REFUSEE",
};

export default function CandidatureDecisionForm({ candidature }: { candidature: any }) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  // Only lock the form if it's a final decision (Accepted or Refused)
  // Entretien and Liste d'attente are intermediate states that can be updated.
  const isFinalDecision = ["ACCEPTEE", "REFUSEE"].includes(candidature.raw.statut);
  const isAlreadyDecided = isFinalDecision;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<DecisionFormValues>({
    resolver: zodResolver(decisionSchema),
    mode: "onChange",
    defaultValues: {
      decision: statusMapToLabel[candidature.raw.statut] || undefined,
      motif: candidature.raw.motifDecision || "",
    }
  });

  const selectedDecision = watch("decision");
  const motifValue = watch("motif", "");

  const onSubmit = async (data: DecisionFormValues) => {
    setErrorMsg("");
    try {
      const bodyData: any = { statut: labelMapToStatus[data.decision] };
      if (data.motif && data.motif.trim() !== "") {
        bodyData.motifDecision = data.motif;
      }

      const res = await fetch(`/api/candidatures/${candidature.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("API Error details:", err);
        const errorMessage = err.error?.message || err.message || "Erreur lors de l'enregistrement";
        throw new Error(errorMessage);
      }

      router.refresh(); // Refresh page to show updated status
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col mt-6">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-[#47295C]" />
          <h2 className="text-xs font-bold text-gray-900">B. Formulaire de Décision</h2>
        </div>
        {isAlreadyDecided && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold">
            Décision déjà prise
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[11px] font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* Decision Radios */}
          <div className={isAlreadyDecided ? "opacity-70 pointer-events-none" : ""}>
            <label className="block text-[10px] font-bold text-gray-900 mb-2">Décision finale <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              
              <label className={`relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                selectedDecision === "Accepté" ? "border-green-500 bg-green-50/30" : "border-gray-200 hover:border-green-200"
              }`}>
                <input type="radio" value="Accepté" {...register("decision")} className="peer sr-only" disabled={isAlreadyDecided} />
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedDecision === "Accepté" ? "border-green-500" : "border-gray-300"
                }`}>
                  {selectedDecision === "Accepté" && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                </div>
                <span className={`text-[10px] font-bold ${selectedDecision === "Accepté" ? "text-green-700" : "text-gray-700"}`}>Accepté</span>
              </label>

              <label className={`relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                selectedDecision === "Entretien éventuel" ? "border-blue-500 bg-blue-50/30" : "border-gray-200 hover:border-blue-200"
              }`}>
                <input type="radio" value="Entretien éventuel" {...register("decision")} className="peer sr-only" disabled={isAlreadyDecided} />
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedDecision === "Entretien éventuel" ? "border-blue-500" : "border-gray-300"
                }`}>
                  {selectedDecision === "Entretien éventuel" && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                </div>
                <span className={`text-[10px] font-bold ${selectedDecision === "Entretien éventuel" ? "text-blue-700" : "text-gray-700"}`}>Entretien</span>
              </label>

              <label className={`relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                selectedDecision === "Liste d'attente" ? "border-orange-500 bg-orange-50/30" : "border-gray-200 hover:border-orange-200"
              }`}>
                <input type="radio" value="Liste d'attente" {...register("decision")} className="peer sr-only" disabled={isAlreadyDecided} />
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedDecision === "Liste d'attente" ? "border-orange-500" : "border-gray-300"
                }`}>
                  {selectedDecision === "Liste d'attente" && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                </div>
                <span className={`text-[10px] font-bold ${selectedDecision === "Liste d'attente" ? "text-orange-700" : "text-gray-700"}`}>Attente</span>
              </label>

              <label className={`relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                selectedDecision === "Refusé" ? "border-red-500 bg-red-50/30" : "border-gray-200 hover:border-red-200"
              }`}>
                <input type="radio" value="Refusé" {...register("decision")} className="peer sr-only" disabled={isAlreadyDecided} />
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedDecision === "Refusé" ? "border-red-500" : "border-gray-300"
                }`}>
                  {selectedDecision === "Refusé" && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                </div>
                <span className={`text-[10px] font-bold ${selectedDecision === "Refusé" ? "text-red-700" : "text-gray-700"}`}>Refusé</span>
              </label>
              
            </div>
            {errors.decision && <p className="text-red-500 text-[9px] mt-1 font-medium">{errors.decision.message}</p>}
          </div>

          {/* Conditional Motif Field */}
          {selectedDecision === "Refusé" && (
            <div className={`animate-in fade-in slide-in-from-top-2 duration-300 ${isAlreadyDecided ? "opacity-70 pointer-events-none" : ""}`}>
              <label className="block text-[10px] font-bold text-gray-900 mb-1">Motif (obligatoire) <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea 
                  {...register("motif")}
                  rows={2}
                  disabled={isAlreadyDecided}
                  className={`w-full p-2 rounded-lg border text-[11px] focus:outline-none focus:ring-1 transition-all resize-none ${
                    errors.motif ? "border-red-300 focus:ring-red-200 bg-red-50/20" : "border-gray-200 focus:ring-[#47295C]/20 focus:border-[#47295C]"
                  }`}
                  placeholder="Saisissez les motifs de refus..."
                ></textarea>
                <div className="absolute bottom-2 right-2 text-[9px] text-gray-400 font-medium">
                  {motifValue?.length || 0} / 1000
                </div>
              </div>
              {errors.motif && (
                <p className="text-red-600 text-[9px] font-medium mt-1">{errors.motif.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isAlreadyDecided && (
          <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={!isValid || isSubmitting}
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                isValid ? "bg-[#47295C] text-white hover:bg-[#5a3875] shadow-[#47295C]/20" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Check size={12} />
              {isSubmitting ? "En cours..." : "Valider"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
