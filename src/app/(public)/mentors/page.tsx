import type { Metadata } from "next";

import MentorsExplorer, { type PublicMentor } from "@/components/features/mentors/MentorsExplorer";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/brand/PageHero";

export const metadata: Metadata = {
  title: "Mentors & experts",
  description: "Les experts qui accompagnent les startups d'IN-CUBATOR, de l'idéation à la levée de fonds.",
};
export const dynamic = "force-dynamic";

const asList = (value: unknown) => (Array.isArray(value) ? (value as unknown[]).map(String) : []);

export default async function MentorsPage() {
  const dbMentors = await prisma.mentorProfile.findMany({
    where: { actif: true },
    orderBy: { noteMoyenne: "desc" },
  });

  const mentors: PublicMentor[] = dbMentors.map((m) => {
    const expertise = asList(m.expertise);
    return {
      id: m.id,
      name: m.nomComplet,
      role: m.titreFonction || expertise[0] || "Expert(e)",
      bio: m.bio,
      expertise,
      secteurs: asList(m.secteurs),
      rating: m.noteMoyenne || 0,
    };
  });

  return (
    <main>
      <PageHero
        title={<>Des experts à vos côtés<span className="text-orange-accent">.</span></>}
        text="Trouvez les mentors qui vous accompagneront à chaque étape de votre croissance."
        image={{ src: "/photos/gen/mentors.webp", alt: "Un mentor expérimenté écoute une jeune fondatrice présenter ses schémas autour d'un café" }}
      />

      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <MentorsExplorer mentors={mentors} />
        </div>
      </section>
    </main>
  );
}
