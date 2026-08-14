import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";

// GET /api/investor/preferences
export async function GET(request: NextRequest) {
  try {
    const { session, error } = await requireRole(['INVESTISSEUR', 'ADMIN', 'GESTIONNAIRE']);
    if (error) return error;

    // Use session user ID to find investor profile
    const investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: { select: { email: true, name: true } }
      }
    });

    if (!investorProfile) {
      return errorResponse("NOT_FOUND", "Profil investisseur non trouvé", undefined, 404);
    }

    return successResponse(investorProfile);
  } catch (err: any) {
    console.error("Erreur GET preferences:", err);
    return errorResponse("SERVER_ERROR", "Erreur lors de la récupération des préférences", undefined, 500);
  }
}

// PUT /api/investor/preferences
export async function PUT(request: NextRequest) {
  try {
    const { session, error } = await requireRole(['INVESTISSEUR']);
    if (error) return error;

    const body = await request.json();
    
    // Extract fields
    const { 
      organisation, 
      typeInvestisseur, 
      siteWeb, 
      bio, 
      secteursCibles, 
      stadesCibles, 
      ticketMin, 
      ticketMax, 
      zoneGeographique,
      emailAlerts,
      watchlistAlerts,
      logoUrl
    } = body;

    // Check if profile exists
    const existingProfile = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id }
    });

    let updatedProfile;

    if (existingProfile) {
      // Update existing profile
      updatedProfile = await prisma.investorProfile.update({
        where: { userId: session.user.id },
        data: {
          organisation: organisation || null,
          typeInvestisseur: typeInvestisseur || null,
          siteWeb: siteWeb || null,
          bio: bio || null,
          secteursCibles: secteursCibles || [],
          stadesCibles: stadesCibles || [],
          ticketMin: ticketMin ? parseInt(ticketMin) : null,
          ticketMax: ticketMax ? parseInt(ticketMax) : null,
          zoneGeographique: zoneGeographique || null,
          emailAlerts: typeof emailAlerts === 'boolean' ? emailAlerts : undefined,
          watchlistAlerts: typeof watchlistAlerts === 'boolean' ? watchlistAlerts : undefined,
          logoUrl: logoUrl || null
        }
      });
    } else {
      // Should rarely happen if signup correctly initializes profile, but handle just in case
      updatedProfile = await prisma.investorProfile.create({
        data: {
          userId: session.user.id,
          organisation: organisation || null,
          typeInvestisseur: typeInvestisseur || null,
          siteWeb: siteWeb || null,
          bio: bio || null,
          secteursCibles: secteursCibles || [],
          stadesCibles: stadesCibles || [],
          ticketMin: ticketMin ? parseInt(ticketMin) : null,
          ticketMax: ticketMax ? parseInt(ticketMax) : null,
          zoneGeographique: zoneGeographique || null,
          emailAlerts: typeof emailAlerts === 'boolean' ? emailAlerts : true,
          watchlistAlerts: typeof watchlistAlerts === 'boolean' ? watchlistAlerts : true,
          logoUrl: logoUrl || null
        }
      });
    }

    return successResponse(updatedProfile);
  } catch (err: any) {
    console.error("Erreur PUT preferences:", err);
    return errorResponse("SERVER_ERROR", "Erreur lors de la sauvegarde des préférences", undefined, 500);
  }
}
