import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import StartupProfileClient from "./StartupProfileClient";


export default async function PublicStartupProfilePage({ params }: { params: { id: string } }) {
  const startup = await prisma.startupProfile.findUnique({
    where: { id: params.id, visiblePublic: true },
  });

  if (!startup) {
    notFound();
  }

  const session = await auth();
  const isInvestor = session?.user?.role === 'INVESTISSEUR';

  let hasRequestedAccess = false;
  if (isInvestor) {
    const investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (investorProfile) {
      const existingRequest = await prisma.accesDealRoom.findUnique({
        where: {
          startupId_investisseurId: {
            startupId: startup.id,
            investisseurId: investorProfile.id
          }
        }
      });
      if (existingRequest) {
        hasRequestedAccess = true;
      }
    }
  }

  const secteurs = Array.isArray(startup.secteurs) ? startup.secteurs as string[] : [];

  return (
    <StartupProfileClient 
      startupId={startup.id}
      nom={startup.nom}
      pitchResume={startup.pitchResume || ""}
      logoUrl={startup.logoUrl}
      secteurs={secteurs}
      isInvestor={isInvestor}
      hasRequestedAccess={hasRequestedAccess}
    />
  );
}
