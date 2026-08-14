"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomeHero() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      
      if (scrollY < vh * 0.5) {
        setStep(0);
      } else if (scrollY < vh * 1.5) {
        setStep(1);
      } else {
        setStep(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDotPosition = () => {
    if (step === 0) return "top-0";
    if (step === 1) return "top-1/2";
    return "top-[100%]";
  };

  return (
    <div id="candidature" className="relative h-[300vh]" data-theme="dark">
      <div className="sticky top-0 h-screen w-full flex flex-col text-white overflow-hidden">
        {/* Background & Overlays */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/ChatGPT Image 9 août 2026, 18_35_05.png" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-[#47295C]/80 mix-blend-multiply"></div>
          {/* CSS Grid Pattern */}
          <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Orbital Rings (CSS simulated) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[85vw] h-[35vw] max-w-[1200px] max-h-[500px] rounded-[50%] border border-violet-main/30 -rotate-12 shadow-[0_0_30px_rgba(150,69,148,0.15)]"></div>
          <div className="absolute w-[75vw] h-[45vw] max-w-[1000px] max-h-[600px] rounded-[50%] border border-orange-accent/10 rotate-12 shadow-[0_0_20px_rgba(212,72,53,0.05)]"></div>
        </div>

        {/* Left Sidebar (Socials) */}
        <aside className="absolute left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-12 text-[10px] font-bold tracking-widest text-gray-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>
          <Link href="#" className="hover:text-white transition-colors">LINKEDIN</Link>
          <span className="text-violet-main/50">•</span>
          <Link href="#" className="hover:text-white transition-colors">INSTAGRAM</Link>
          <span className="text-violet-main/50">•</span>
          <Link href="#" className="hover:text-white transition-colors">TWITTER</Link>
        </aside>

        {/* Right Sidebar (Scroll) */}
        <aside className="absolute right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center justify-between h-[450px]">
          <div className="text-[10px] font-bold tracking-widest text-gray-400 rotate-90 whitespace-nowrap mb-24" style={{ transformOrigin: 'left center' }}>
            SCROLL TO EXPLORE
          </div>
          <div className="relative h-32 w-[1px] bg-white/20 my-6">
              <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-700 ease-in-out ${getDotPosition()}`}></div>
          </div>
          <div className="flex flex-col gap-3 text-[10px] font-mono text-gray-400">
            <span className="text-white">0{step + 1}</span>
            <span className="w-full h-[1px] bg-white/20"></span>
            <span>03</span>
          </div>
        </aside>

        {/* Main Content / Orbit Elements */}
        <main className="relative flex-1 flex items-center justify-center z-10 w-full pt-20">
          {/* Center Text */}
          <div 
            key={step}
            className="text-center z-20 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-[0_0_50px_rgba(150,69,148,0.4)] uppercase w-full px-4">
              {step === 0 && "INNOVER. ACCÉLÉRER. FINANCER."}
              {step === 1 && "CONNECTER. BÂTIR. DÉPLOYER."}
              {step === 2 && "STRUCTURER. MENTORER. LEVER."}
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 font-light max-w-xl px-4 drop-shadow-md leading-relaxed">
              {step === 0 && "L'écosystème complet pour transformer votre vision en startup performante. Un accompagnement de bout en bout, de l'idéation à la Deal Room sécurisée."}
              {step === 1 && "Rejoignez un réseau d'experts exclusif et d'investisseurs stratégiques. Un accompagnement sur-mesure et des outils dédiés pour propulser votre croissance."}
              {step === 2 && "Votre espace centralisé pour piloter votre roadmap, collaborer en direct avec vos mentors et convaincre les investisseurs grâce à une Deal Room maîtrisée."}
            </p>
          </div>

          {/* Orbit Items */}
          <div className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto pointer-events-none">
          </div>
        </main>

        {/* Bottom Footer */}
        <footer className="relative z-50 p-8 flex flex-col lg:flex-row justify-between items-end lg:items-end w-full mt-auto gap-8">
          
          {/* Left Info */}
          <div className="flex flex-col gap-5 w-full lg:w-1/3">
            <p className="text-sm text-gray-300 font-light leading-relaxed max-w-[300px]">
              Mentorat, Deal Room et espaces startups conçus autour de vos idées, de vos équipes et de votre croissance.
            </p>
            <div className="flex gap-4">
              <Link href="/contact" className="border border-white/50 px-6 py-2.5 rounded-md text-xs font-bold tracking-widest uppercase text-white hover:bg-[#964594] hover:text-white hover:border-[#964594] transition-all w-fit">
                NOUS CONTACTER
              </Link>
            </div>
          </div>

          {/* Center */}
          <div className="w-full lg:w-1/3"></div>

          {/* Right Action */}
          <div className="w-full lg:w-1/3"></div>

        </footer>
      </div>
    </div>
  );
}
