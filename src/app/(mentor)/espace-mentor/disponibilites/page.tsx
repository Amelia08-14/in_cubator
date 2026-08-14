import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DisponibilitesClient from "./DisponibilitesClient";


export default async function MentorDisponibilitesPage() {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    redirect("/connexion");
  }

  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      disponibilites: {
        where: { dateDebut: { gte: new Date() } },
        orderBy: { dateDebut: 'asc' }
      }
    }
  });

  if (!mentorProfile) {
    redirect("/");
  }

  // Format records for the client UI
  const initialSlots = mentorProfile.disponibilites.map(d => {
    // Format to local date time strings to match client expectations
    // Using string manipulation to ensure timezones don't shift the day
    
    // We expect dateDebut to be stored in UTC but represent local time for simplicity, 
    // or we just format it cleanly:
    const dDate = new Date(d.dateDebut);
    const dDateStr = dDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // pad to 2 digits
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const startTime = `${pad(dDate.getUTCHours())}:${pad(dDate.getUTCMinutes())}`;
    
    const eDate = new Date(d.dateFin);
    const endTime = `${pad(eDate.getUTCHours())}:${pad(eDate.getUTCMinutes())}`;

    return {
      id: d.id,
      dateStr: dDateStr,
      startTime,
      endTime,
      format: d.format as "Visioconférence" | "En présentiel",
      type: d.type as "Individuel" | "Groupe",
      capacity: d.capacity || undefined,
      reservee: d.reservee
    };
  });

  return (
    <DisponibilitesClient 
      initialSlots={initialSlots} 
      mentorInitials={mentorProfile.nomComplet ? mentorProfile.nomComplet.substring(0, 2).toUpperCase() : "M"} 
    />
  );
}
