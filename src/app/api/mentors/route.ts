import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { auth } from "@/auth";
import { currentRealm } from "@/lib/realm";


export async function GET(request: Request) {
  try {
    const session = await auth(await currentRealm());
    const { searchParams } = new URL(request.url);
    
    const secteur = searchParams.get('secteur');
    const expertise = searchParams.get('expertise');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Most mentor lists are public or at least accessible to authenticated users
    // Let's say all users can see mentors, but maybe less details if not authenticated

    const mentors = await prisma.mentorProfile.findMany({
      where: {
        actif: true,
        ...(secteur ? { secteurs: { string_contains: secteur } } : {}),
        ...(expertise ? { expertise: { string_contains: expertise } } : {}),
      },
      select: {
        id: true,
        user: { select: { id: true } }, // Do not expose email by default
        expertise: true,
        secteurs: true,
        langues: true,
        bio: true,
        noteMoyenne: true,
        // Only authenticated users might see the tarif
        tarifIndicatif: !!session?.user,
      },
      take: limit,
    });

    return successResponse(mentors);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
