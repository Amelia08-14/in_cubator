import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Target,
  ShieldCheck,
  ArrowRight,
  Users,
  Rocket,
  Handshake,
  TrendingUp,
  Star,
  Activity,
  FlaskConical,
  Leaf,
  User,
  Building2,
  Globe,
  Clock,
  Shield,
  Smartphone
} from "lucide-react";

export default function CandidaturePage() {
  return (
    <div className="min-h-screen bg-white text-[#47295C] relative overflow-x-hidden pb-24" data-theme="light">
      
      {/* Background Hero Graphic (Subtle) */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none opacity-30 z-0 hidden lg:block">
        <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] rounded-full border-[1px] border-[#47295C]/20"></div>
        <div className="absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-[#964594]"></div>
        <div className="absolute top-[70%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#964594]"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="w-full max-w-[1100px] mx-auto px-8 pt-32 pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Content */}
          <div className="flex-1 flex flex-col max-w-xl">
            <span className="text-[10px] font-bold text-[#47295C] tracking-widest uppercase mb-6">
              Candidature intelligente
            </span>
            
            <h1 className="font-serif font-extrabold text-5xl md:text-[56px] text-[#47295C] leading-[1.1] mb-8">
              Votre innovation <br /> mérite le bon accompagnement.
            </h1>
            
            <div className="w-12 h-1 bg-[#47295C] mb-8"></div>
            
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              IN-CUBATOR accompagne les startups à fort impact en santé, pharma, biotech, AgriTech et entrepreneuriat féminin à chaque étape de leur croissance.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#F3EEF5] flex items-center justify-center text-[#964594] mb-1">
                  <Zap size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#47295C] text-sm">Rapide</h3>
                <p className="text-xs text-gray-500 leading-relaxed">En quelques minutes</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#F3EEF5] flex items-center justify-center text-[#964594] mb-1">
                  <Target size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#47295C] text-sm">Intelligent</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Matching sur mesure</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#F3EEF5] flex items-center justify-center text-[#964594] mb-1">
                  <ShieldCheck size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#47295C] text-sm">Sécurisé</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Données protégées</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link 
                href="/candidature/formulaire" 
                className="bg-[#47295C] text-white px-8 py-4 rounded-lg text-sm font-bold tracking-wide hover:bg-[#964594] transition-colors flex items-center justify-center gap-2 group shadow-md shadow-[#47295C]/20"
              >
                Commencer ma candidature
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <ShieldCheck size={16} className="text-[#964594]" />
                Confidentialité garantie
              </div>
            </div>
          </div>
          
          {/* Right Image/Illustration area */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative min-h-[500px]">
            <div className="relative w-[400px] h-[500px] flex items-center justify-center">
              
              {/* Outer Orbital Ring */}
              <div className="absolute inset-4 rounded-full border border-gray-200/60 z-0"></div>
              
              {/* Inner Circle */}
              <div className="absolute inset-16 rounded-full border border-gray-100 bg-white/50 z-10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, #e5e7eb 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: 'center'
                }}></div>
              </div>

              {/* The main phone mockup frame */}
              <div className="relative z-20 w-[240px] h-[480px] bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(71,41,92,0.12)] border-8 border-white overflow-hidden flex flex-col ring-1 ring-gray-100">
                <div className="bg-[#F9F7FA] p-5 flex flex-col gap-6 flex-1">
                  {/* Header inside phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#47295C] rounded flex items-center justify-center text-white font-bold italic text-xs">
                      IN
                    </div>
                    <div>
                      <div className="font-bold text-[#47295C] text-xs leading-tight">IN-CUBATOR</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Plateforme IN-OS</div>
                    </div>
                  </div>
                  
                  {/* Skeleton content */}
                  <div className="space-y-4 mt-6">
                    <div className="h-3 bg-gray-200/60 rounded-full w-2/3"></div>
                    <div className="h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center px-3">
                       <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center px-3">
                       <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="h-20 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                       <div className="h-2 w-1/3 bg-gray-100 rounded-full mb-2"></div>
                       <div className="h-2 w-full bg-gray-50 rounded-full mb-1"></div>
                       <div className="h-2 w-4/5 bg-gray-50 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="w-full py-3 bg-[#47295C] rounded-lg flex items-center justify-center gap-2 text-white shadow-md">
                      <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements matching out-cubator style */}
              <div className="absolute top-10 right-10 w-12 h-12 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110 animate-bounce" style={{ animationDuration: '4s' }}>
                <Target className="text-[#964594]" size={20} strokeWidth={1.5} />
              </div>
              <div className="absolute top-1/2 left-4 w-14 h-14 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>
                <Users className="text-[#47295C]" size={24} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-20 right-4 w-12 h-12 bg-white rounded-full border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center z-30 transition-transform hover:scale-110 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                <Leaf className="text-[#964594]" size={20} strokeWidth={1.5} />
              </div>
              
            </div>
          </div>
        </section>

        {/* Program Section */}
        <section className="w-full bg-[#F9F7FA] py-24">
          <div className="max-w-[1100px] mx-auto px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[10px] font-bold text-[#47295C] tracking-widest uppercase mb-4">
                UN PROGRAMME COMPLET
              </span>
              <h2 className="font-serif font-extrabold text-4xl text-[#47295C] mb-6">
                Accélérez votre startup
              </h2>
              <div className="w-12 h-1 bg-[#47295C]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { icon: Users, title: "Sur-mesure", desc: "Un suivi personnalisé par des experts." },
                { icon: Rocket, title: "Ressources", desc: "Outils, contenus et infrastructures de pointe." },
                { icon: Handshake, title: "Réseau", desc: "Connexion aux investisseurs et leaders." },
                { icon: TrendingUp, title: "Financement", desc: "Préparation aux levées de fonds." },
                { icon: Star, title: "Visibilité", desc: "Valorisation auprès du marché." },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-100 p-8 rounded-2xl flex flex-col items-center text-center group hover:shadow-[0_4px_24px_rgba(71,41,92,0.08)] transition-all duration-300">
                  <div className="w-14 h-14 bg-[#F3EEF5] text-[#964594] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#47295C] group-hover:text-white transition-colors duration-300">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-bold text-[#47295C] text-sm mb-3">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="w-full bg-white py-24">
          <div className="max-w-[1100px] mx-auto px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[10px] font-bold text-[#47295C] tracking-widest uppercase mb-4">
                NOS SECTEURS CLÉS
              </span>
              <h2 className="font-serif font-extrabold text-4xl text-[#47295C] mb-6">
                Impact durable
              </h2>
              <div className="w-12 h-1 bg-[#47295C]"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[
                { icon: Activity, title: "Santé", desc: "Solutions innovantes pour le parcours patient." },
                { icon: FlaskConical, title: "Pharma & Biotech", desc: "Innovations et dispositifs médicaux." },
                { icon: Leaf, title: "AgriTech", desc: "Technologies agricoles pour l'avenir." },
                { icon: User, title: "Entrepreneuriat féminin", desc: "Valorisation des fondatrices." },
                { icon: Building2, title: "Hôpital", desc: "Co-construction avec les établissements." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 mb-4 text-[#47295C] bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-[#964594]/30 transition-all duration-300">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-bold text-[#47295C] text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[160px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-8 mb-12">
          <div className="w-full max-w-[1100px] mx-auto bg-[#47295C] rounded-2xl p-10 md:p-14 relative overflow-hidden shadow-[0_8px_32px_rgba(71,41,92,0.2)]">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#964594]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl">
                <h2 className="font-serif font-extrabold text-3xl lg:text-4xl mb-4 text-white">
                  Prêt(e) à faire décoller votre innovation ?
                </h2>
                <p className="text-[#F3EEF5] text-lg mb-8 opacity-90">
                  La candidature ne prend que quelques minutes.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 text-sm text-[#F3EEF5] font-medium opacity-80">
                  <div className="flex items-center gap-2">
                    <Globe size={18} />
                    100% en ligne
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    Réponse rapide
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={18} />
                    Sans engagement
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 w-full lg:w-auto mt-8 lg:mt-0">
                <Link 
                  href="/candidature/formulaire" 
                  className="bg-white text-[#47295C] px-8 py-4 rounded-lg text-sm font-bold tracking-wide hover:bg-[#F9F7FA] transition-colors flex items-center justify-center gap-2 group w-full lg:w-auto"
                >
                  Commencer ma candidature
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
