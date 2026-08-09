import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative w-full text-white pt-24 pb-12 overflow-hidden flex flex-col justify-end" data-theme="dark">
      
      {/* Background & Overlays (Match Hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/ChatGPT Image 9 août 2026, 18_35_05.png" 
          alt="Footer Background" 
          fill 
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#0c051a]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c051a] via-[#0c051a]/80 to-transparent"></div>
        {/* CSS Grid Pattern */}
        <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-8 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 border-b border-white/10 pb-16">
          
          <div className="flex flex-col gap-6">
            <div className="text-3xl font-serif font-bold flex items-center text-white">
              in<span className="text-[#964594] font-sans">.</span>cubator
            </div>
            <p className="max-w-md text-gray-400 font-light text-sm leading-relaxed">
              Propulser les idées audacieuses vers l'avenir. Le premier programme d'incubation qui remplace les parcours complexes par une plateforme claire, intégrée et construite pour accélérer votre croissance.
            </p>
          </div>

          <div className="flex flex-col gap-6 items-start md:items-end">
            <h4 className="font-bold tracking-widest text-xs uppercase text-white/90">Restez informé</h4>
            <div className="flex items-center">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="bg-white/5 border border-white/10 rounded-l-md px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white w-64 placeholder:text-gray-600 transition-colors"
              />
              <button className="bg-white text-[#0c051a] font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-r-md hover:bg-gray-200 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs tracking-widest text-gray-500 mb-2 uppercase">Programme</h4>
            <Link href="/candidature" className="text-gray-300 hover:text-white text-sm transition-colors">Candidature</Link>
            <Link href="/vitrine" className="text-gray-300 hover:text-white text-sm transition-colors">Vitrine Startups</Link>
            <Link href="/mentors" className="text-gray-300 hover:text-white text-sm transition-colors">Nos Mentors</Link>
            <Link href="/out-cubator" className="text-gray-300 hover:text-white text-sm transition-colors">Out-Cubator</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs tracking-widest text-gray-500 mb-2 uppercase">Ressources</h4>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Documentation</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Blog</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Études de cas</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs tracking-widest text-gray-500 mb-2 uppercase">Légal</h4>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Mentions Légales</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Confidentialité</Link>
            <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">CGU</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs tracking-widest text-gray-500 mb-2 uppercase">Contact</h4>
            <p className="text-gray-300 text-sm">Paris, France</p>
            <a href="mailto:contact@in.cubator" className="text-[#c4a4e3] hover:text-white text-sm transition-colors">contact@in.cubator</a>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs hover:bg-white hover:text-[#0c051a] transition-all">in</a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs hover:bg-white hover:text-[#0c051a] transition-all">tw</a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs hover:bg-white hover:text-[#0c051a] transition-all">ig</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-center items-center text-gray-500 text-xs gap-4 pt-8 border-t border-white/10">
          <p>© {new Date().getFullYear()} in.cubator. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
