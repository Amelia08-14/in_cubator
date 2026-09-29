import { prisma } from "@/lib/prisma";
import Hero from "@/components/features/home/Hero";
import Parcours from "@/components/features/home/Parcours";
import Ecosystem from "@/components/features/home/Ecosystem";
import NetworkBand from "@/components/features/home/NetworkBand";
import DiasporaTeaser from "@/components/features/home/DiasporaTeaser";
import StartupsStrip from "@/components/features/home/StartupsStrip";
import MentorsStrip from "@/components/features/home/MentorsStrip";
import LeadCTA from "@/components/features/home/LeadCTA";
import EventsSection from "@/components/features/home/EventsSection";
import type { EventItem } from "@/lib/events/types";
import { publicApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

// Les évènements viennent de l'API : si elle est indisponible, l'accueil reste affiché sans eux.
async function loadUpcomingEvents(): Promise<EventItem[]> {
  try {
    return (await publicApi<{ events: EventItem[] }>("/api/events?scope=upcoming&limit=3")).events;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [dbMentors, dbStartups, events] = await Promise.all([
    prisma.mentorProfile.findMany({ where: { actif: true }, take: 4, orderBy: { noteMoyenne: "desc" } }),
    prisma.startupProfile.findMany({
      where: { visiblePublic: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    loadUpcomingEvents(),
  ]);

  const mentors = dbMentors.map((m) => {
    const expertise = Array.isArray(m.expertise) ? (m.expertise as string[]) : [];
    return {
      id: m.id,
      nomComplet: m.nomComplet,
      role: m.titreFonction || expertise[0] || "Expert",
      bio: m.bio,
    };
  });

  const startups = dbStartups.map((s) => {
    const secteurs = Array.isArray(s.secteurs) ? (s.secteurs as string[]) : [];
    return {
      id: s.id,
      nom: s.nom,
      secteur: secteurs[0] ?? "Général",
      stade: s.stade,
      description: s.pitchResume || s.description,
      logoUrl: s.logoUrl,
    };
  });

  return (
    <main>
      <Hero />
      <Parcours />
      <Ecosystem />
      <NetworkBand />
      <EventsSection events={events} />
      <StartupsStrip startups={startups} />
      <DiasporaTeaser />
      <MentorsStrip mentors={mentors} />
      <LeadCTA />
    </main>
  );
}
