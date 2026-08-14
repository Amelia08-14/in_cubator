import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TextReveal from "@/components/features/public/TextReveal";
import StartupShowcase from "@/components/features/public/StartupShowcase";
import OutCubator from "@/components/features/public/OutCubator";
import Footer from "@/components/layouts/Footer";
import HomeHero from "@/components/features/public/HomeHero";


export default async function Home() {
  const dbMentors = await prisma.mentorProfile.findMany({
    where: { actif: true },
    take: 4, // Take up to 4 mentors to showcase
  });

  return (
    <div className="font-sans bg-violet-dark">
      <HomeHero />

      {/* Intro section */}
      <section className="min-h-screen w-full bg-white bg-pattern relative z-50 flex items-center justify-center p-8" data-theme="light">
        <TextReveal text="Nous aidons les startups à remplacer les parcours complexes par une plateforme claire, intégrée et construite pour accélérer leur croissance." />
      </section>

      {/* Portfolio / Startups Section (Centralized Scroll) */}
      <section id="vitrine" className="min-h-screen w-full bg-[#fcfcfd] bg-pattern relative z-50 flex flex-col p-8 pt-32 lg:px-24 pb-24 text-[#47295C]" data-theme="light">
        {/* Abstract Background Curves */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg className="absolute w-[150vw] h-[150vh] -top-[30%] -left-[25%] opacity-10 stroke-[#964594]" fill="none" viewBox="0 0 1000 1000">
            <path d="M0,500 C300,200 700,800 1000,500 C1300,200 1700,800 2000,500" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M0,700 C400,300 600,900 1000,700 C1400,300 1600,900 2000,700" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center relative z-10">
          {/* Animated Header Area */}
          <TextReveal 
            text="Découvrez les projets qui réinventent demain." 
            subtitle="Une sélection des startups les plus prometteuses soutenues par IN-CUBATOR."
          />
        </div>
      </section>

      {/* Full Screen Pinned Horizontal Scroll */}
      <StartupShowcase />

      {/* White Spacer Section */}
      <section className="w-full min-h-[60vh] bg-white relative z-50 flex items-center justify-center p-8" data-theme="light">
        <TextReveal 
          text="Pourquoi des experts ? Parce que le talent seul ne suffit pas. L'expérience de ceux qui ont déjà bâti des empires est le seul vrai raccourci vers le sommet." 
          subtitle=""
        />
      </section>

      {/* Mentors Preview Section */}
      {dbMentors.length > 0 && (
        <section id="mentors" className="w-full bg-white bg-pattern relative z-50 flex items-center justify-center py-32 px-8 text-[#47295C]" data-theme="light">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
            
            <TextReveal 
              text="Rencontrez nos experts" 
              subtitle="Des professionnels expérimentés pour vous guider de l'idéation à la levée de fonds."
              className="w-full text-center mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-16 px-4">
              {dbMentors.map((mentor) => {
                const expertiseArray = Array.isArray(mentor.expertise) ? (mentor.expertise as string[]) : [];
                const role = expertiseArray.length > 0 ? expertiseArray[0] : "Expert";
                const firstSecteur = Array.isArray(mentor.secteurs) && mentor.secteurs.length > 0 ? mentor.secteurs[0] : "Secteur";

                return (
                  <div key={mentor.id} className="flex flex-col items-center text-center p-12 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                    {/* Anonymous Avatar */}
                    <div className="w-36 h-36 rounded-full border-4 border-[#D44835]/40 bg-gradient-to-br from-gray-50 to-gray-200 mb-6 shadow-inner relative overflow-hidden">
                      <Image src="/placeholder-avatar.png" alt={mentor.nomComplet || "Mentor avatar"} fill className="object-cover" />
                    </div>
                    
                    <h3 className="font-serif font-extrabold text-2xl md:text-3xl mb-1 text-[#47295C]">{mentor.nomComplet}</h3>
                    <p className="text-sm md:text-base text-[#964594] font-bold tracking-wide uppercase mb-6">{role}</p>
                    
                    <p className="text-sm md:text-base text-gray-500 italic mb-8 leading-relaxed line-clamp-4">
                      {mentor.bio}
                    </p>
                    
                    <div className="mt-auto flex gap-4 text-gray-400">
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#964594] hover:border-[#964594] hover:text-white transition-colors cursor-pointer text-xs">in</div>
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#964594] hover:border-[#964594] hover:text-white transition-colors cursor-pointer text-xs">tw</div>
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#964594] hover:border-[#964594] hover:text-white transition-colors cursor-pointer text-xs">✉</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 text-center flex flex-col items-center">
              <Link href="/mentors" className="px-8 py-4 rounded-md bg-[#47295C] text-white font-bold text-sm shadow-xl hover:bg-[#964594] hover:scale-105 transition-all flex items-center gap-3">
                Découvrir tous les mentors
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* White Spacer Section (Transition to Out-Cubator) */}
      <section id="out-cubator" className="w-full min-h-[60vh] bg-[#fcfcfd] bg-pattern relative z-50 flex items-center justify-center p-8 pb-0" data-theme="light">
        <TextReveal 
          superTitle="NOS ALUMNI"
          text="Des startups qui continuent d'aller loin." 
          subtitle="Découvrez quelques startups qui ont terminé le programme IN-CUBATOR et qui créent aujourd'hui un impact réel."
        />
      </section>

      {/* Out-Cubator Section */}
      <OutCubator />
    </div>
  );
}
