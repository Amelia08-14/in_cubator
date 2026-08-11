import * as z from "zod";

export const step1Schema = z.object({
  startupName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slogan: z.string().max(120, "Le slogan ne doit pas dépasser 120 caractères").optional(),
  creationDate: z.string().min(1, "La date de création est requise"),
  country: z.string().min(1, "Le pays est requis"),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(500, "Maximum 500 caractères"),
});

export const step2Schema = z.object({
  team: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(2, "Le nom est requis"),
      role: z.string().min(2, "Le rôle est requis"),
      email: z.string().email("Email invalide"),
    })
  ).min(1, "Au moins un membre est requis"),
});

export const step3Schema = z.object({
  sector: z.string().min(1, "Veuillez sélectionner un secteur"),
  stage: z.string().min(1, "Veuillez sélectionner un stade d'avancement"),
});

export const step4Schema = z.object({
  problemSolved: z.string().min(20, "Veuillez détailler le problème que vous résolvez (min 20 caractères)"),
  needs: z.string().min(20, "Veuillez exprimer vos besoins (min 20 caractères)"),
});

export type Step1FormValues = z.infer<typeof step1Schema>;
export type Step2FormValues = z.infer<typeof step2Schema>;
export type Step3FormValues = z.infer<typeof step3Schema>;
export type Step4FormValues = z.infer<typeof step4Schema>;
