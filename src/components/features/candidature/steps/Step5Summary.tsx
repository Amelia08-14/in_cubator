"use client";

import React from "react";
import { useCandidatureFormStore, CandidatureData } from "@/lib/store/candidatureStore";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Step5Summary() {
  const { formData, prevStep, resetForm } = useCandidatureFormStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: CandidatureData) => {
      const response = await fetch("/api/candidatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de la candidature");
      }

      return response.json();
    },
    onSuccess: () => {
      // Clear the store and redirect to a success page or back to home
      resetForm();
      // For now we can just alert and go to home
      alert("Candidature envoyée avec succès ! Votre compte a été créé.");
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    },
  });

  const onSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#47295C] mb-2">Récapitulatif + soumission</h2>
        <p className="text-gray-500 mb-6">Veuillez vérifier vos informations avant de valider votre candidature.</p>
      </div>

      <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm">
        
        {/* Identité */}
        <div>
          <h3 className="font-bold text-[#47295C] border-b border-gray-200 pb-2 mb-3">1. Identité de la startup</h3>
          <div className="grid grid-cols-2 gap-2 text-gray-700">
            <span className="font-semibold">Nom :</span> <span>{formData.startupName}</span>
            <span className="font-semibold">Slogan :</span> <span>{formData.slogan || "-"}</span>
            <span className="font-semibold">Création :</span> <span>{formData.creationDate}</span>
            <span className="font-semibold">Pays :</span> <span>{formData.country}</span>
            <span className="font-semibold">Site web :</span> <span>{formData.website || "-"}</span>
            <span className="font-semibold">Description :</span> <span className="col-span-2 mt-1">{formData.description}</span>
          </div>
        </div>

        {/* Equipe */}
        <div>
          <h3 className="font-bold text-[#47295C] border-b border-gray-200 pb-2 mb-3">2. Équipe ({formData.team.length} membres)</h3>
          <ul className="space-y-2">
            {formData.team.map((member, i) => (
              <li key={member.id} className="text-gray-700">
                <span className="font-semibold">{member.name}</span> — {member.role} ({member.email})
              </li>
            ))}
          </ul>
        </div>

        {/* Secteur */}
        <div>
          <h3 className="font-bold text-[#47295C] border-b border-gray-200 pb-2 mb-3">3. Secteur et stade d'avancement</h3>
          <div className="grid grid-cols-2 gap-2 text-gray-700">
            <span className="font-semibold">Secteur :</span> <span>{formData.sector}</span>
            <span className="font-semibold">Stade :</span> <span>{formData.stage}</span>
          </div>
        </div>

        {/* Détails */}
        <div>
          <h3 className="font-bold text-[#47295C] border-b border-gray-200 pb-2 mb-3">4. Description et Besoins</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <span className="font-semibold block mb-1">Problème résolu :</span>
              <p className="whitespace-pre-wrap">{formData.problemSolved}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">Besoins :</span>
              <p className="whitespace-pre-wrap">{formData.needs}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={prevStep}
          disabled={mutation.isPending}
          className="text-[#47295C] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Précédent
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={mutation.isPending}
          className="bg-[#47295C] text-white px-8 py-3 rounded-lg text-sm font-bold tracking-wide hover:bg-[#964594] transition-colors flex items-center justify-center gap-2 group shadow-md disabled:opacity-70"
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Soumission en cours...
            </>
          ) : (
            <>
              Valider la candidature
              <Check size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
