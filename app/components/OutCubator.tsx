import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Package, Network } from 'lucide-react';

const alumni = [
  {
    id: 1,
    name: "NeuroMind",
    tags: "HealthTech • IA",
    desc: "Solutions IA pour la santé mentale et le bien-être.",
    year: "Sortie en 2024",
    logoBg: "bg-[#4a2394]",
    initial: "N"
  },
  {
    id: 2,
    name: "Payflow",
    tags: "Fintech",
    desc: "Infrastructure de paiement pour les entreprises africaines.",
    year: "Sortie en 2023",
    logoBg: "bg-[#0b287a]",
    initial: "P"
  },
  {
    id: 3,
    name: "Greenly",
    tags: "Impact • Environnement",
    desc: "Mesurer. Réduire. Agir. Pour une planète durable.",
    year: "Sortie en 2024",
    logoBg: "bg-[#337a1f]",
    initial: "G"
  },
  {
    id: 4,
    name: "Edulink",
    tags: "EdTech",
    desc: "L'éducation immersive pour tous.",
    year: "Sortie en 2023",
    logoBg: "bg-[#c23e15]",
    initial: "E"
  },
  {
    id: 5,
    name: "DataPulse",
    tags: "IA • Data",
    desc: "Transformer les données en décisions.",
    year: "Sortie en 2024",
    logoBg: "bg-[#38157a]",
    initial: "D"
  }
];

export default function OutCubator() {
  return (
    <section className="w-full bg-[#fcfcfd] min-h-screen pt-24 pb-48 relative overflow-hidden text-[#0c051a]" data-theme="light">
      
      {/* Background Decor (Subtle Grid/Dots) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#0c051a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
      }}></div>
      
      {/* Top Left Faint Glow */}
      <div className="absolute top-0 left-0 w-1/2 h-[400px] bg-[#592d83] rounded-full mix-blend-multiply filter blur-[150px] opacity-[0.02] pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col gap-24">
        
        {/* --- SECTION A: HERO SPLIT --- */}
        <div className="relative flex flex-col xl:flex-row gap-16 items-center min-h-[70vh] py-12">


          {/* Faint curved line background decoration */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
            <div className="w-[120%] h-[150%] rounded-[100%] border-[1px] border-[#592d83]/30 absolute -left-[20%] rotate-6"></div>
            <div className="w-2 h-2 rounded-full bg-[#592d83] absolute top-[25%] left-[55%]"></div>
            <div className="w-2 h-2 rounded-full bg-[#592d83] absolute bottom-[15%] left-[30%]"></div>
          </div>

          {/* Left: Text */}
          <div className="flex-1 flex flex-col relative z-10 pl-0 xl:pl-16">
            <span className="text-[#592d83] font-bold text-xs tracking-widest uppercase mb-6 flex items-center gap-4">
              OUT-CUBATOR
              <div className="h-[2px] w-8 bg-[#592d83]"></div>
            </span>
            <h2 className="font-serif font-extrabold text-5xl lg:text-[4.5rem] leading-[1.1] mb-8 tracking-tight text-[#0c051a]">
              Au-delà de<br />
              l'incubation.<br />
              L'impact durable.
            </h2>
            <p className="text-gray-500 font-medium text-base md:text-lg mb-12 max-w-[420px] leading-relaxed">
              OUT-CUBATOR accompagne les startups qui ont terminé le programme IN-CUBATOR pour accélérer leur croissance, renforcer leur impact et ouvrir de nouvelles opportunités.
            </p>
          </div>
          
          {/* Right: Mission Card */}
          <div className="flex-1 w-full relative z-10 pr-0 xl:pr-12">
            <div className="w-full relative h-[480px] bg-[#0c051a] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(12,5,26,0.15)] flex flex-col items-center justify-center text-center p-12 group">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#592d83]/20 via-[#0c051a] to-[#0c051a] opacity-80"></div>
              
              {/* Swirling faint lines in background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-white rotate-12 group-hover:rotate-45 transition-transform duration-[3s]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-white -rotate-12 group-hover:-rotate-45 transition-transform duration-[3s]"></div>
              </div>

              {/* Door/Exit Icon Graphic */}
              <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#c4a4e3]/10 rounded-full blur-2xl group-hover:bg-[#c4a4e3]/20 transition-colors duration-700"></div>
                <svg className="w-16 h-16 text-[#c4a4e3] relative z-10 drop-shadow-[0_0_15px_rgba(196,164,227,0.4)] group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9" />
                </svg>
              </div>

              <h3 className="font-serif text-3xl font-bold text-white mb-6 leading-tight relative z-10">
                Notre mission
              </h3>
              <p className="text-gray-300 font-light text-sm leading-relaxed max-w-[300px] relative z-10">
                Aller plus loin, ensemble.<br />
                Nous restons engagés aux côtés des fondateurs pour transformer leurs idées en entreprises solides et inspirantes.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- SECTION B: ALUMNI CARDS --- */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col mt-32">
        
        {/* Link Row */}
        <div className="flex justify-end mb-8">
          <Link href="/alumni" className="text-[13px] font-bold text-[#592d83] hover:text-[#0c051a] transition-colors flex items-center gap-2 group">
            Voir toutes les startups <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Row */}
        <div className="w-full overflow-x-auto pb-8 hide-scrollbar">
          <div className="flex gap-6 min-w-max">
            {alumni.map(startup => (
              <div key={startup.id} className="w-[320px] bg-white rounded-[20px] border border-[#f0f0f5] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-white shadow-sm ${startup.logoBg}`}>
                    {startup.id === 3 ? <Leaf size={28} strokeWidth={1.5} /> : 
                     startup.id === 4 ? <Package size={28} strokeWidth={1.5} /> : 
                     startup.id === 5 ? <Network size={28} strokeWidth={1.5} /> : 
                     <span className="font-bold text-[28px] leading-none">{startup.initial}</span>}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-bold text-[#0c051a] text-[15px] tracking-tight">{startup.name}</h4>
                    <p className="text-[11px] text-[#718096] font-medium">{startup.tags}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-[#592d83] mr-2 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
