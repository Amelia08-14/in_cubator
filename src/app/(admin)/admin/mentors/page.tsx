import React from "react";
import { prisma } from "@/lib/prisma";
import ClientPage from "./ClientPage";


export default async function AdminMentorsPage() {
  const mentorProfiles = await prisma.mentorProfile.findMany({
    include: {
      user: true
    },
    orderBy: {
      user: {
        createdAt: 'desc'
      }
    }
  });

  // Transform Prisma models into the structure expected by the frontend
  const mentorsData = mentorProfiles.map((mentor) => {
    // Secteurs is stored as Json in the DB, parse it back to array if needed
    // In Prisma, retrieving a Json field usually gives the parsed object, 
    // assuming it was saved as an array of strings.
    const sectors = Array.isArray(mentor.secteurs) 
      ? mentor.secteurs 
      : typeof mentor.secteurs === 'string' 
        ? JSON.parse(mentor.secteurs) 
        : [];
        
    const title = Array.isArray(mentor.expertise) && mentor.expertise.length > 0 
      ? mentor.expertise[0] 
      : "Expert Indépendant";

    return {
      id: mentor.id, // The UI expects a number but it's a cuid string, we'll cast to any or change the UI interface
      name: mentor.nomComplet || mentor.user.email.split('@')[0],
      title: title,
      sectors: sectors,
      hours: 0, // Placeholder
      month: new Date().toLocaleString('fr-FR', { month: 'long' }),
      rating: mentor.noteMoyenne || 5.0,
      reviews: 0, // Placeholder
      status: mentor.actif ? 'Actif' : 'Inactif',
      img: ''
    };
  });

  return <ClientPage mentors={mentorsData} />;
}
