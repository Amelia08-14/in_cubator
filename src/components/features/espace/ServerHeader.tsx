import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Header from "./Header";


export default async function ServerHeader() {
  const session = await auth();

  if (!session?.user?.id) {
    return <Header />;
  }

  const startupProfile = await prisma.startupProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      objectifs: {
        include: { taches: true }
      },
      user: true
    }
  });

  if (!startupProfile) {
    return <Header />;
  }

  // Calculate progress from objectives/tasks
  const totalTaches = startupProfile.objectifs.reduce((acc, obj) => acc + obj.taches.length, 0);
  const completedTaches = startupProfile.objectifs.reduce(
    (acc, obj) => acc + obj.taches.filter(t => t.statut === "TERMINE").length, 0
  );
  const progressPercent = totalTaches > 0 ? Math.round((completedTaches / totalTaches) * 100) : 0;

  const headerData = {
    userName: startupProfile.user.email.split("@")[0],
    progressPercent,
    completedObjectives: completedTaches,
    totalObjectives: totalTaches,
  };

  return <Header data={headerData} />;
}
