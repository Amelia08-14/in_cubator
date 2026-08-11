"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, Step2FormValues } from "@/lib/schemas/candidature";
import { useCandidatureFormStore } from "@/lib/store/candidatureStore";
import { ArrowRight, ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function Step2Team() {
  const { formData, updateFormData, nextStep, prevStep } = useCandidatureFormStore();
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      team: formData.team.length > 0 ? formData.team : [{ id: crypto.randomUUID(), name: "", role: "", email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "team",
  });

  const onSubmit = (data: Step2FormValues) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#47295C] mb-2">Équipe</h2>
        <p className="text-gray-500 mb-6">Présentez les membres clés de votre équipe.</p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative">
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Supprimer ce membre"
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <h3 className="font-bold text-[#47295C] mb-4">Membre {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#47295C] mb-1">Nom complet *</label>
                <input
                  {...register(`team.${index}.name` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#964594] bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ex: Jane Doe"
                />
                {errors.team?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.team[index]?.name?.message}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#47295C] mb-1">Rôle *</label>
                <input
                  {...register(`team.${index}.role` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#964594] bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ex: CEO / CTO"
                />
                {errors.team?.[index]?.role && <p className="text-red-500 text-xs mt-1">{errors.team[index]?.role?.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#47295C] mb-1">Email *</label>
                <input
                  type="email"
                  {...register(`team.${index}.email` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#964594] bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ex: jane@startup.com"
                />
                {errors.team?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.team[index]?.email?.message}</p>}
              </div>
            </div>
            
            <input type="hidden" {...register(`team.${index}.id` as const)} value={field.id} />
          </div>
        ))}
      </div>

      {errors.team?.root && (
        <p className="text-red-500 text-sm mt-2">{errors.team.root.message}</p>
      )}

      <button
        type="button"
        onClick={() => append({ id: crypto.randomUUID(), name: "", role: "", email: "" })}
        className="w-full py-3 border-2 border-dashed border-[#47295C]/30 text-[#47295C] font-bold rounded-xl hover:bg-[#F9F7FA] hover:border-[#47295C]/50 transition-colors flex items-center justify-center gap-2 mt-4"
      >
        <Plus size={18} />
        Ajouter un membre
      </button>

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
