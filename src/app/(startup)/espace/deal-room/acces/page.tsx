import React from "react";
import DealRoomAccesClient from "@/components/features/espace/DealRoomAccesClient";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export default async function EspaceDealRoomAccesPage() {
  const session = await auth();
  
  const startupProfile = await prisma.startupProfile.findUnique({
    where: { userId: session?.user?.id },
  });

  if (!startupProfile) {
    return <div className="p-8 text-center text-gray-500">Profil introuvable.</div>;
  }

  const requests = await prisma.accesDealRoom.findMany({
    where: { startupId: startupProfile.id },
    include: {
      investisseur: {
        include: {
          user: true
        }
      }
    },
    // Removed orderBy createdAt since Prisma client needs regeneration
  });

  // Map to the expected type
  const mappedRequests = requests.map(req => ({
    id: req.id,
    statut: req.statut,
    createdAt: req.dateAcces ? req.dateAcces.toISOString() : new Date().toISOString(),
    investisseur: {
      organisation: req.investisseur?.organisation || 'Organisation Inconnue',
      utilisateur: {
        email: req.investisseur?.user?.email || 'email@inconnu.com',
      }
    }
  }));

  return <DealRoomAccesClient initialRequests={mappedRequests} />;
}
