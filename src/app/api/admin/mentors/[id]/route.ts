import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireRole(['ADMIN', 'GESTIONNAIRE']);
    if (error) return error;

    const { id } = await context.params;
    const { actif } = await request.json();

    if (typeof actif !== 'boolean') {
      return errorResponse("BAD_REQUEST", "Statut 'actif' invalide", undefined, 400);
    }

    const updatedMentor = await prisma.mentorProfile.update({
      where: { id },
      data: { actif }
    });

    return successResponse(updatedMentor);
  } catch (err: any) {
    return errorResponse("SERVER_ERROR", err.message || "Erreur interne", undefined, 500);
  }
}
