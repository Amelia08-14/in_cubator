import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";


export async function POST(request: Request) {
  try {
    const { session, error } = await requireRole(['INVESTISSEUR']);
    if (error) return error;

    const data = await request.json();
    const { startupId } = data;

    if (!startupId) {
      return errorResponse('VALIDATION_ERROR', 'startupId est requis', undefined, 400);
    }

    const investor = await prisma.investorProfile.findUnique({
      where: { userId: session!.user.id }
    });

    if (!investor) {
      return errorResponse('NOT_FOUND', 'Profil investisseur introuvable', undefined, 404);
    }

    // Check if request already exists
    const existing = await prisma.accesDealRoom.findUnique({
      where: {
        startupId_investisseurId: {
          startupId: startupId,
          investisseurId: investor.id
        }
      }
    });

    if (existing) {
      return errorResponse('CONFLICT', 'Une demande d\'accès existe déjà', undefined, 409);
    }

    const acces = await prisma.accesDealRoom.create({
      data: {
        startupId,
        investisseurId: investor.id,
        statut: 'DEMANDE'
      }
    });

    return NextResponse.json({ success: true, data: acces, message: 'Demande envoyée avec succès' }, { status: 201 });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
