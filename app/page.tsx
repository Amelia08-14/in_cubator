"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import TextReveal from "./components/TextReveal";
import StartupShowcase from "./components/StartupShowcase";
import OutCubator from "./components/OutCubator";
import Footer from "./components/Footer";

export default function Home() {
  const [step, setStep] = useState(0);
  const [isHeaderDark, setIsHeaderDark] = useState(false);

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

      // Check header theme based on data-theme attribute
      const sections = document.querySelectorAll('[data-theme]');
      let currentTheme = 'dark'; // default to dark
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Check if the top of the section is above the middle of the header (approx 40px)
        // and the bottom of the section is below the middle of the header
        if (rect.top <= 40 && rect.bottom >= 40) {
          currentTheme = section.getAttribute('data-theme') || 'dark';
        }
      });
      setIsHeaderDark(currentTheme === 'light');
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDotPosition = () => {
    if (step === 0) return "top-0";
    if (step === 1) return "top-1/2";
    return "top-[100%]";
  };

  return (
    <div className="font-sans bg-violet-dark">
      {/* Global Fixed Header */}
      <header className={`fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center transition-all duration-500 ${isHeaderDark ? 'bg-white border-b border-gray-200 shadow-sm' : `bg-[#0c051a]/80 backdrop-blur-md border-b ${step > 0 ? 'border-white/10' : 'border-transparent'}`}`}>
        <div className={`text-2xl font-serif font-bold flex items-center transition-colors duration-500 ${isHeaderDark ? 'text-violet-dark' : 'text-white'}`}>
          in<span className="text-violet-main font-sans">.</span>cubator
        </div>
        <nav className={`hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isHeaderDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <a href="#candidature" className={`transition-colors cursor-pointer ${isHeaderDark ? 'hover:text-violet-dark' : 'hover:text-white'}`}>Candidature</a>
          <span className="text-violet-main/50">•</span>
          <a href="#vitrine" className={`transition-colors cursor-pointer ${isHeaderDark ? 'hover:text-violet-dark' : 'hover:text-white'}`}>Vitrine</a>
          <span className="text-violet-main/50">•</span>
          <a href="#mentors" className={`transition-colors cursor-pointer ${isHeaderDark ? 'hover:text-violet-dark' : 'hover:text-white'}`}>Mentors</a>
          <span className="text-violet-main/50">•</span>
          <a href="#out-cubator" className={`transition-colors cursor-pointer ${isHeaderDark ? 'hover:text-violet-dark' : 'hover:text-white'}`}>Out-cubator</a>
        </nav>
        <div className="flex items-center">
          <Link 
            href="/connect" 
            className={`px-6 py-2.5 rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-500 border ${
              isHeaderDark 
                ? 'border-gray-300 text-violet-dark hover:bg-violet-dark hover:text-white hover:border-violet-dark' 
                : 'border-white/50 text-white hover:bg-white hover:text-violet-dark hover:border-white'
            }`}
          >
            CONNECT
          </Link>
        </div>
      </header>

      {/* 
        This wrapper is 300vh tall, creating 3 "screens" worth of scrolling distance.
      */}
      <div id="candidature" className="relative h-[300vh]" data-theme="dark">
        {/* 
          The sticky container locks the hero UI to the screen while the user scrolls 
          through the 300vh wrapper.
        */}
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
            <div className="absolute inset-0 bg-[#0c051a]/80 mix-blend-multiply"></div>
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
            <Link href="#" className="hover:text-white transition-colors">DRIBBBLE</Link>
            <span className="text-violet-main/50">•</span>
            <Link href="#" className="hover:text-white transition-colors">GITHUB</Link>
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
              <Link href="/contact" className="border border-white/50 px-6 py-2.5 rounded-md text-xs font-bold tracking-widest uppercase text-white hover:bg-white hover:text-violet-dark transition-all w-fit">
                CONTACT
              </Link>
            </div>

            {/* Center */}
            <div className="w-full lg:w-1/3"></div>

            {/* Right Action */}
            <div className="w-full lg:w-1/3"></div>

          </footer>
        </div>
      </div>

      {/* Scroll Reveal Section */}
      <section className="min-h-screen w-full bg-white relative z-50 flex items-center justify-center p-8" data-theme="light">
        <TextReveal text="Nous aidons les startups à remplacer les parcours complexes par une plateforme claire, intégrée et construite pour accélérer leur croissance." />
      </section>

      {/* Portfolio / Startups Section (Centralized Scroll) */}
      <section id="vitrine" className="min-h-screen w-full bg-[#fcfcfd] relative z-50 flex flex-col p-8 pt-32 lg:px-24 pb-24 text-[#0c051a]" data-theme="light">
        {/* Abstract Background Curves */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg className="absolute w-[150vw] h-[150vh] -top-[30%] -left-[25%] opacity-10 stroke-[#592d83]" fill="none" viewBox="0 0 1000 1000">
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
      <section id="mentors" className="w-full bg-white relative z-50 flex items-center justify-center py-32 px-8 text-[#0c051a]" data-theme="light">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
          
          <TextReveal 
            text="Rencontrez nos experts" 
            subtitle="Des professionnels expérimentés pour vous guider de l'idéation à la levée de fonds."
            className="w-full text-center mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-16 px-4">
            
            {/* Expert 1 */}
            <div className="flex flex-col items-center text-center p-12 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              {/* Anonymous Avatar */}
              <div className="w-36 h-36 rounded-full border-4 border-[#d44835]/40 bg-gradient-to-br from-gray-50 to-gray-200 mb-6 shadow-inner"></div>
              
              <h3 className="font-serif font-extrabold text-3xl mb-1 text-[#0c051a]">Expert Stratégie</h3>
              <p className="text-base text-[#592d83] font-bold tracking-wide uppercase mb-6">Go-to-Market</p>
              
              <p className="text-base text-gray-500 italic mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              
              <div className="mt-auto flex gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">in</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">tw</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">✉</div>
              </div>
            </div>

            {/* Expert 2 */}
            <div className="flex flex-col items-center text-center p-12 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              {/* Anonymous Avatar */}
              <div className="w-36 h-36 rounded-full border-4 border-[#d44835]/40 bg-gradient-to-br from-gray-50 to-gray-200 mb-6 shadow-inner"></div>
              
              <h3 className="font-serif font-extrabold text-3xl mb-1 text-[#0c051a]">Expert Finance</h3>
              <p className="text-base text-[#592d83] font-bold tracking-wide uppercase mb-6">Partner VC</p>
              
              <p className="text-base text-gray-500 italic mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              
              <div className="mt-auto flex gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">in</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">tw</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">✉</div>
              </div>
            </div>

            {/* Expert 3 */}
            <div className="flex flex-col items-center text-center p-12 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              {/* Anonymous Avatar */}
              <div className="w-36 h-36 rounded-full border-4 border-[#d44835]/40 bg-gradient-to-br from-gray-50 to-gray-200 mb-6 shadow-inner"></div>
              
              <h3 className="font-serif font-extrabold text-3xl mb-1 text-[#0c051a]">Expert Tech</h3>
              <p className="text-base text-[#592d83] font-bold tracking-wide uppercase mb-6">CTO Fractional</p>
              
              <p className="text-base text-gray-500 italic mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              
              <div className="mt-auto flex gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">in</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">tw</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">✉</div>
              </div>
            </div>

            {/* Expert 4 */}
            <div className="flex flex-col items-center text-center p-12 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              {/* Anonymous Avatar */}
              <div className="w-36 h-36 rounded-full border-4 border-[#d44835]/40 bg-gradient-to-br from-gray-50 to-gray-200 mb-6 shadow-inner"></div>
              
              <h3 className="font-serif font-extrabold text-3xl mb-1 text-[#0c051a]">Expert Growth</h3>
              <p className="text-base text-[#592d83] font-bold tracking-wide uppercase mb-6">Marketing B2B</p>
              
              <p className="text-base text-gray-500 italic mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              
              <div className="mt-auto flex gap-4 text-gray-400">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">in</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">tw</div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#592d83] hover:text-white transition-colors cursor-pointer text-xs">✉</div>
              </div>
            </div>

          </div>

          <Link href="/mentors" className="px-8 py-4 rounded-md bg-[#0c051a] text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
            Découvrir tous les mentors
          </Link>
        </div>
      </section>

      {/* White Spacer Section (Transition to Out-Cubator) */}
      <section id="out-cubator" className="w-full min-h-[60vh] bg-[#fcfcfd] relative z-50 flex items-center justify-center p-8 pb-0" data-theme="light">
        <TextReveal 
          superTitle="NOS ALUMNI"
          text="Des startups qui continuent d'aller loin." 
          subtitle="Découvrez quelques startups qui ont terminé le programme IN-CUBATOR et qui créent aujourd'hui un impact réel."
        />
      </section>

      {/* Out-Cubator Section */}
      <OutCubator />

      {/* Footer */}
      <Footer />
    </div>
  );
}
