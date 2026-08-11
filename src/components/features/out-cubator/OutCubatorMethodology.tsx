import React from "react";
import { Search, LayoutGrid, Users, BarChart, RefreshCw } from "lucide-react";

export default function OutCubatorMethodology() {
  const steps = [
    {
      number: "01",
      title: "Diagnostic",
      desc: "Comprendre les enjeux, les acteurs et le potentiel du territoire.",
      icon: <Search size={20} />
    },
    {
      number: "02",
      title: "Structuration",
      desc: "Concevoir des modèles, processus et outils adaptés au contexte local.",
      icon: <LayoutGrid size={20} />
    },
    {
      number: "03",
      title: "Accompagnement",
      desc: "Renforcer les capacités des équipes et des structures pour un déploiement efficace.",
      icon: <Users size={20} />
    },
    {
      number: "04",
      title: "Évaluation",
      desc: "Mesurer l'impact et la performance pour guider les décisions.",
      icon: <BarChart size={20} />
    },
    {
      number: "05",
      title: "Amélioration continue",
      desc: "Capitaliser, ajuster et innover pour une amélioration continue des systèmes.",
      icon: <RefreshCw size={20} />
    }
  ];

  return (
    <section className="w-full bg-[#F9F7FA] py-20 mt-16">
      <div className="max-w-[1100px] mx-auto px-8 flex flex-col lg:flex-row gap-16">
        
        {/* Left Side */}
        <div className="lg:w-1/3 flex flex-col">
          <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-[#47295C] mb-6">
            Notre méthodologie
          </h2>
          <div className="w-12 h-1 bg-[#47295C] mb-6"></div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Une approche systémique et itérative pour concevoir, structurer 
            et piloter des systèmes d'incubation performants et durables.
          </p>
        </div>

        {/* Right Side - Timeline */}
        <div className="lg:w-2/3 relative mt-8 lg:mt-0">
          
          {/* Dashed line connecting icons */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-[1px] border-t-2 border-dashed border-[#47295C]/20 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-full bg-white border border-[#47295C]/20 text-[#47295C] flex items-center justify-center mb-4 shadow-sm">
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 mb-1">{step.number}</span>
                  <h4 className="font-bold text-xs text-[#47295C] mb-3">{step.title}</h4>
                  <p className="text-[9px] text-gray-500 leading-relaxed max-w-[140px]">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
          
        </div>

      </div>
    </section>
  );
}
