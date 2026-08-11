"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, Step1FormValues } from "@/lib/schemas/candidature";
import { useCandidatureFormStore } from "@/lib/store/candidatureStore";
import { ArrowRight } from "lucide-react";

export default function Step1Identity() {
  const { formData, updateFormData, nextStep } = useCandidatureFormStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      startupName: formData.startupName,
      slogan: formData.slogan,
      creationDate: formData.creationDate,
      country: formData.country,
      website: formData.website,
      description: formData.description,
    },
  });

  const onSubmit = (data: Step1FormValues) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#47295C] mb-2">Identité du projet et de la startup</h2>
        <p className="text-gray-500 mb-6">Commençons par les informations de base sur votre projet.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-1">Nom de votre startup *</label>
          <input
            {...register("startupName")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Ex : HealthTech Solutions"
          />
          {errors.startupName && <p className="text-red-500 text-xs mt-1">{errors.startupName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-1">Slogan (facultatif)</label>
          <input
            {...register("slogan")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Ex : Innover pour une santé meilleure"
          />
          {errors.slogan && <p className="text-red-500 text-xs mt-1">{errors.slogan.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-1">Date de création *</label>
          <input
            type="date"
            {...register("creationDate")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
          />
          {errors.creationDate && <p className="text-red-500 text-xs mt-1">{errors.creationDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-1">Pays d'origine *</label>
          <select
            {...register("country")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] bg-white text-gray-900"
          >
            <option value="">Sélectionnez un pays</option>
            <option value="France">France</option>
            <option value="Maroc">Maroc</option>
            <option value="Canada">Canada</option>
            <option value="Suisse">Suisse</option>
            <option value="Autre">Autre</option>
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-1">Site web (facultatif)</label>
          <input
            type="url"
            {...register("website")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="https://votre-site.com"
          />
          {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#47295C] mb-1">Brève présentation de votre startup *</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#964594] text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Décrivez en quelques phrases votre startup et sa mission."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
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
