import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ParametresClient from "./ParametresClient";


export default async function MentorParametresPage() {
  const session = await auth();
  
  if (!session || !session.user?.id) {
    redirect("/connexion");
  }

  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  if (!mentorProfile) {
    // Edge case where the user role is mentor but no profile exists
    // (Should be handled in auth/onboarding, but safe to redirect)
    redirect("/");
  }

  // Parse JSON arrays for safe passing to client
  const parsedSecteurs = Array.isArray(mentorProfile.secteurs) 
    ? mentorProfile.secteurs 
    : (typeof mentorProfile.secteurs === 'string' ? JSON.parse(mentorProfile.secteurs) : []);
    
  const parsedExpertise = Array.isArray(mentorProfile.expertise) 
    ? mentorProfile.expertise 
    : (typeof mentorProfile.expertise === 'string' ? JSON.parse(mentorProfile.expertise) : []);

  const serializedProfile = {
    id: mentorProfile.id,
    nomComplet: mentorProfile.nomComplet,
    titreFonction: mentorProfile.titreFonction || "",
    bio: mentorProfile.bio || "",
    linkedinUrl: mentorProfile.linkedinUrl || "",
    secteurs: parsedSecteurs,
    expertise: parsedExpertise,
    email: mentorProfile.user.email,
  };

  return <ParametresClient initialData={serializedProfile} />;
}
