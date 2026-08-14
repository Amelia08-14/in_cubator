import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";


export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return errorResponse("UNAUTHORIZED", "Non autorisé", undefined, 401);
    }

    const body = await request.json();
    const { nomComplet, titreFonction, bio, linkedinUrl, secteurs, expertise } = body;

    // Verify the mentor profile belongs to this user
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!existingProfile) {
      return errorResponse("NOT_FOUND", "Profil mentor introuvable", undefined, 404);
    }

    // Update the profile
    const updatedProfile = await prisma.mentorProfile.update({
      where: { id: existingProfile.id },
      data: {
        ...(nomComplet !== undefined && { nomComplet }),
        ...(titreFonction !== undefined && { titreFonction }),
        ...(bio !== undefined && { bio }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(secteurs !== undefined && { secteurs }),
        ...(expertise !== undefined && { expertise }),
      }
    });

    return successResponse(updatedProfile, undefined, 200);
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la mise à jour du profil", undefined, 500);
  }
}
