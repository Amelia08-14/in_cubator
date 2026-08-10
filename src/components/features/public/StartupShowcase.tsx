import React from 'react';
import Image from 'next/image';

const startups = [
  {
    id: 1,
    name: "NexaFlow",
    status: "EN LIGNE",
    title: "L'automatisation intelligente pour les équipes agiles",
    desc: "Plateforme no-code propulsée par l'IA pour orchestrer l'ensemble de vos workflows internes en un clin d'œil.",
    product: "SaaS Dashboard",
    market: "Global B2B",
    priority: "Productivité",
    surface: "Web App",
    img: "/startup_fintech.png"
  },
  {
    id: 2,
    name: "LuminaHealth",
    status: "BETA",
    title: "La télémédecine prédictive au service des patients",
    desc: "Suivi médical en temps réel analysant les biomarqueurs pour anticiper les urgences de santé et améliorer le suivi post-opératoire.",
    product: "IoT & Mobile App",
    market: "Europe",
    priority: "Healthcare",
    surface: "Mobile / Watch",
    img: "/startup_health.png"
  },
  {
    id: 3,
    name: "GreenChain",
    status: "LANCEMENT",
    title: "Traçabilité carbone certifiée par la blockchain",
    desc: "Une solution complète pour mesurer, optimiser et certifier l'empreinte carbone de votre chaîne d'approvisionnement en temps réel.",
    product: "API & Dashboard",
    market: "Industrie / Logistique",
    priority: "Sustainability",
    surface: "Web App",
    img: "/startup_edtech.png"
  }
];

export default function StartupShowcase() {
  return (
    <div data-theme="dark" className="w-full relative bg-[#47295C] py-32 px-4 overflow-hidden">
      
      {/* Hero-like Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ChatGPT Image 9 août 2026, 18_35_05.png"
          alt="Showcase Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#47295C]/60 to-[#47295C]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col gap-16">
        {startups.map((startup) => (
          <div key={startup.id} className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 bg-[#47295C]/40 backdrop-blur-xl text-white p-8 lg:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
            
            {/* Left Column (Text & Data) */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <h4 className="font-bold text-xl tracking-tight">{startup.name}</h4>
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">{startup.status}</span>
                </div>
                
                {/* Title & Desc */}
                <h3 className="font-serif font-extrabold text-3xl md:text-4xl lg:text-[2.75rem] mb-6 leading-[1.1] tracking-tight text-white">
                  {startup.title}
                </h3>
                <p className="text-base md:text-lg text-gray-300 font-sans font-light opacity-90 max-w-xl mb-12">
                  {startup.desc}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-t border-b border-white/10 py-6 mb-8">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Produit</p>
                    <p className="text-base font-medium">{startup.product}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Marché</p>
                    <p className="text-base font-medium">{startup.market}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Priorité</p>
                    <p className="text-base font-medium">{startup.priority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Surface</p>
                    <p className="text-base font-medium">{startup.surface}</p>
                  </div>
                </div>
                
                {/* Footer Links */}
                <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/90">
                  <a href="#" className="flex items-center gap-2 hover:text-[#c4a4e3] transition-colors group">
                    VOIR L'ÉTUDE <span className="text-lg leading-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 hover:text-[#c4a4e3] transition-colors group">
                    SITE EN LIGNE <span className="text-lg leading-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right Column (Image Mockup) */}
            <div className="w-full lg:w-[45%] flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-transparent rounded-[1.5rem] p-6 lg:p-10 border border-white/10 relative group">
              {/* Decorative background grid in the image container */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none rounded-[1.5rem]" style={{
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
              }}></div>
              
              {/* Floating Mockup Box */}
              <div className="relative w-full aspect-[4/3] transform transition-all duration-700 group-hover:scale-[1.03] group-hover:-translate-y-2 z-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden bg-[#080312] border border-white/20">
                
                {/* Mockup Header (like a browser window) */}
                <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                
                {/* Image / Content */}
                <div className="relative w-full h-[calc(100%-2rem)]">
                  <Image 
                    src={startup.img} 
                    alt={startup.name}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#964594]/20 to-transparent mix-blend-screen pointer-events-none"></div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
