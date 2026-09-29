import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { auth } from "@/auth";
import { currentRealm } from "@/lib/realm";


export async function GET(request: Request) {
  try {
    const session = await auth(await currentRealm());
    const { searchParams } = new URL(request.url);
    
    // Filters
    const secteur = searchParams.get('secteur');
    const stade = searchParams.get('stade');
    const limit = parseInt(searchParams.get('limit') || '50');

    // If not authenticated, only show public startups
    const isPublicQuery = !session?.user;

    const startups = await prisma.startupProfile.findMany({
      where: {
        ...(isPublicQuery ? { visiblePublic: true } : {}),
        ...(stade ? { stade: stade as any } : {}),
        // For JSON arrays in MySQL, Prisma JSON filtering is somewhat limited depending on DB.
        // We'll use a string contain as a simple workaround for the MVP if exact JSON filtering is tricky.
        ...(secteur ? { secteurs: { string_contains: secteur } } : {}),
      },
      select: {
        id: true,
        nom: true,
        secteurs: true,
        stade: true,
        description: true,
        pitchResume: true,
        logoUrl: true,
        siteWeb: true,
        besoins: !isPublicQuery, // Hide needs from unauthenticated users
        visiblePublic: !isPublicQuery,
      },
      take: limit,
    });

    return successResponse(startups);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
