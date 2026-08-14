import React from "react";
import EspaceMentorsClient from "./EspaceMentorsClient";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export default async function EspaceMentorsPage() {
  const session = await auth();
  const startupProfile = await prisma.startupProfile.findUnique({
    where: { userId: session?.user?.id },
  });

  const dbMentors = await prisma.mentorProfile.findMany({
    where: { actif: true },
    include: {
      disponibilites: {
        where: {
          reservee: false,
          dateDebut: { gte: new Date() }
        },
        orderBy: { dateDebut: 'asc' }
      }
    }
  });

  const formattedMentors = dbMentors.map((m) => {
    const expertiseArray = Array.isArray(m.expertise) ? m.expertise as string[] : [];
    const secteursArray = Array.isArray(m.secteurs) ? m.secteurs as string[] : [];
    
    return {
      id: m.id,
      name: m.nomComplet,
      role: expertiseArray.length > 0 ? expertiseArray[0] : "Expert(e)",
      tags: secteursArray.slice(0, 2),
      rating: m.noteMoyenne || 5.0,
      reviewCount: 0,
      image: "/placeholder-avatar.png",
      disponibilites: m.disponibilites.map(d => ({
        id: d.id,
        dateDebut: d.dateDebut.toISOString(),
        dateFin: d.dateFin.toISOString(),
        format: d.format,
        type: d.type
      }))
    };
  });

  return (
    <EspaceMentorsClient 
      initialMentors={formattedMentors} 
      startupId={startupProfile?.id || ""} 
    />
  );
}
