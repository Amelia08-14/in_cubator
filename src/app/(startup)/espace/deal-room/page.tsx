import React from "react";
import DealRoomClient from "@/components/features/espace/DealRoomClient";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export default async function EspaceDealRoomPage() {
  const session = await auth();
  
  const startupProfile = await prisma.startupProfile.findUnique({
    where: { userId: session?.user?.id },
    include: {
      documents: {
        orderBy: { createdAt: 'desc' }
      },
      accesDealRoom: {
        include: { investisseur: true },
        orderBy: { dateAcces: 'desc' }
      }
    }
  });

  if (!startupProfile) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucun profil startup trouvé.
      </div>
    );
  }

  return (
    <DealRoomClient 
      initialDocuments={startupProfile.documents} 
      initialAccessRequests={startupProfile.accesDealRoom}
      startupId={startupProfile.id} 
    />
  );
}
