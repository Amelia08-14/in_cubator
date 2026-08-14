import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return errorResponse("UNAUTHORIZED", "Non autorisé", undefined, 401);
    }

    const { id } = await params;

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!mentorProfile) {
      return errorResponse("NOT_FOUND", "Profil mentor introuvable", undefined, 404);
    }

    const slot = await prisma.disponibilite.findUnique({
      where: { id }
    });

    if (!slot) {
      return errorResponse("NOT_FOUND", "Créneau introuvable", undefined, 404);
    }

    if (slot.mentorId !== mentorProfile.id) {
      return errorResponse("FORBIDDEN", "Non autorisé", undefined, 403);
    }

    if (slot.reservee) {
      return errorResponse("BAD_REQUEST", "Impossible de supprimer un créneau réservé", undefined, 400);
    }

    await prisma.disponibilite.delete({
      where: { id }
    });

    return successResponse(null, undefined, 200);
  } catch (error) {
    console.error("Error deleting disponibilite:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la suppression", undefined, 500);
  }
}
