"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, Step3FormValues } from "@/lib/schemas/candidature";
import { useCandidatureFormStore } from "@/lib/store/candidatureStore";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function Step3Sector() {
  const { formData, updateFormData, nextStep, prevStep } = useCandidatureFormStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      sector: formData.sector,
      stage: formData.stage,
    },
  });

  const onSubmit = (data: Step3FormValues) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#47295C] mb-2">Secteur et stade d'avancement</h2>
        <p className="text-gray-500 mb-6">Aidez-nous à mieux cerner votre marché et votre maturité.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-2">Secteur d'activité *</label>
          <select
            {...register("sector")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] bg-white text-gray-900"
          >
            <option value="">Sélectionnez votre secteur principal</option>
            <option value="Santé">Santé (Parcours patient, Prévention...)</option>
            <option value="Pharma & Biotech">Pharma & Biotech</option>
            <option value="AgriTech">AgriTech</option>
            <option value="Entrepreneuriat Féminin">Entrepreneuriat Féminin (Généraliste)</option>
            <option value="Innovation Hospitalière">Innovation Hospitalière</option>
            <option value="Autre">Autre Tech / Impact</option>
          </select>
          {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-2">Stade d'avancement *</label>
          <select
            {...register("stage")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] bg-white text-gray-900"
          >
            <option value="">Sélectionnez le stade actuel du projet</option>
            <option value="Idée">Idée / Proof of Concept en cours</option>
            <option value="MVP">MVP prêt / Prototype fonctionnel</option>
            <option value="Premiers clients">Premiers clients (Early traction)</option>
            <option value="Croissance">Croissance (Série A / Scale)</option>
          </select>
          {errors.stage && <p className="text-red-500 text-xs mt-1">{errors.stage.message}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={prevStep}
          className="text-[#47295C] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Précédent
        </button>
        <button
          type="submit"
          className="bg-[#47295C] text-white px-8 py-3 rounded-lg text-sm font-bold tracking-wide hover:bg-[#964594] transition-colors flex items-center justify-center gap-2 group"
        >
          Suivant
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
