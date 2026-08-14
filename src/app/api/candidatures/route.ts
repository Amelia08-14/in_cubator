import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const CreateCandidatureSchema = z.object({
  cohorteId: z.string().optional(),
  startup: z.object({
    nom: z.string().min(2).max(120),
    secteurs: z.array(z.string()).min(1),
    stade: z.enum(['IDEE', 'PROTOTYPE', 'EARLY_TRACTION', 'SCALE']),
    description: z.string().min(10).max(2000),
    besoins: z.array(z.string()).min(1),
    membres: z.array(z.object({
      nom: z.string(),
      role: z.string(),
      linkedin: z.string().url().optional().or(z.literal("")),
    })).min(1),
  }),
  reponses: z.record(z.string(), z.unknown()), // sections du formulaire structuré
});

export async function POST(request: Request) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP']);
    if (error) return error;

    const data = await request.json();
    const parsedData = CreateCandidatureSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { cohorteId, startup, reponses } = parsedData.data;

    // Get or create an open cohorte for testing
    let activeCohorte = await prisma.cohorte.findFirst({
      where: { statut: "OUVERTE_CANDIDATURES" }
    });

    if (!activeCohorte) {
      activeCohorte = await prisma.cohorte.create({
        data: {
          nom: "Cohorte Hiver 2026",
          dateDebut: new Date(),
          dateFin: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          statut: "OUVERTE_CANDIDATURES"
        }
      });
    }

    // We assume the porteur_startup already exists as a User, but we must create the StartupProfile if it doesn't exist.
    // Or we just update the existing one.
    let startupProfile = await prisma.startupProfile.findUnique({
      where: { userId: session!.user.id }
    });

    if (!startupProfile) {
      startupProfile = await prisma.startupProfile.create({
        data: {
          userId: session!.user.id,
          nom: startup.nom,
          secteurs: startup.secteurs,
          stade: startup.stade,
          description: startup.description,
          besoins: startup.besoins,
          cohorteId: activeCohorte.id,
        }
      });

      // Create team members
      await prisma.teamMember.createMany({
        data: startup.membres.map(m => ({
          startupId: startupProfile!.id,
          nom: m.nom,
          role: m.role,
          linkedin: m.linkedin || null,
        }))
      });
    }

    const candidature = await prisma.candidature.create({
      data: {
        startupId: startupProfile.id,
        cohorteId: activeCohorte.id,
        reponses: reponses as any,
      }
    });

    return successResponse(candidature, undefined, 201);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne du serveur', undefined, 500);
  }
}

export async function GET(request: Request) {
  try {
    const { session, error } = await requireRole(['GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut') as any;
    const cohorteId = searchParams.get('cohorteId');

    const candidatures = await prisma.candidature.findMany({
      where: {
        ...(statut ? { statut } : {}),
        ...(cohorteId ? { cohorteId } : {}),
      },
      include: {
        startup: true,
        cohorte: true,
      }
    });

    return successResponse(candidatures);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne du serveur', undefined, 500);
  }
}
