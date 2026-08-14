import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";


export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return errorResponse("UNAUTHORIZED", "Non autorisé", undefined, 401);
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!mentorProfile) {
      return errorResponse("NOT_FOUND", "Profil mentor introuvable", undefined, 404);
    }

    const body = await request.json();
    const { dateStr, startTime, endTime, format, type, capacity } = body;

    if (!dateStr || !startTime || !endTime) {
      return errorResponse("BAD_REQUEST", "Informations incomplètes", undefined, 400);
    }

    const dateDebut = new Date(`${dateStr}T${startTime}:00`);
    const dateFin = new Date(`${dateStr}T${endTime}:00`);

    const newSlot = await prisma.disponibilite.create({
      data: {
        mentorId: mentorProfile.id,
        dateDebut,
        dateFin,
        format: format || "Visioconférence",
        type: type || "Individuel",
        capacity: type === "Groupe" ? (capacity || 5) : null
      }
    });

    return successResponse(newSlot, undefined, 201);
  } catch (error) {
    console.error("Error creating disponibilite:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la création", undefined, 500);
  }
}
