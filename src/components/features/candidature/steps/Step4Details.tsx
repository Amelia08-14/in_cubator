"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema, Step4FormValues } from "@/lib/schemas/candidature";
import { useCandidatureFormStore } from "@/lib/store/candidatureStore";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function Step4Details() {
  const { formData, updateFormData, nextStep, prevStep } = useCandidatureFormStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4FormValues>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      problemSolved: formData.problemSolved,
      needs: formData.needs,
    },
  });

  const onSubmit = (data: Step4FormValues) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#47295C] mb-2">Description et Besoins</h2>
        <p className="text-gray-500 mb-6">Détaillez le problème que vous résolvez et ce que vous attendez de l'incubateur.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-2">Quel problème résolvez-vous ? *</label>
          <p className="text-xs text-gray-500 mb-2">Décrivez la douleur du marché, votre solution et en quoi elle est innovante.</p>
          <textarea
            {...register("problemSolved")}
            rows={5}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Notre solution permet de..."
          />
          {errors.problemSolved && <p className="text-red-500 text-xs mt-1">{errors.problemSolved.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-2">Quels sont vos besoins exprimés envers l'incubateur ? *</label>
          <p className="text-xs text-gray-500 mb-2">Financement, réseau médical, expertise réglementaire, bureaux, mentoring tech...</p>
          <textarea
            {...register("needs")}
            rows={5}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Nous recherchons un accompagnement sur..."
          />
          {errors.needs && <p className="text-red-500 text-xs mt-1">{errors.needs.message}</p>}
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
