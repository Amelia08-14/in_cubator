import React from "react";
import { ShieldCheck, Puzzle, Users, ArrowRightLeft, Heart } from "lucide-react";

export default function OutCubatorValues() {
  const values = [
    {
      title: "Durabilité",
      desc: "Des systèmes conçus pour durer et évoluer dans le temps.",
      icon: <ShieldCheck size={28} />
    },
    {
      title: "Cohérence",
      desc: "Des initiatives alignées sur les besoins réels des territoires.",
      icon: <Puzzle size={28} />
    },
    {
      title: "Autonomie",
      desc: "Renforcer l'autonomie locale tout en favorisant la coopération.",
      icon: <Users size={28} />
    },
    {
      title: "Adaptabilité",
      desc: "Des modèles flexibles, capables de s'adapter à chaque contexte.",
      icon: <ArrowRightLeft size={28} />
    },
    {
      title: "Intégrité",
      desc: "Agir avec transparence, éthique et responsabilité dans chaque démarche.",
      icon: <Heart size={28} />
    }
  ];

  return (
    <section className="w-full max-w-[1100px] mx-auto px-8 py-20">
      
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-[#47295C] mb-6">
          Notre philosophie & nos valeurs
        </h2>
        <div className="w-8 h-1 bg-[#47295C] mb-6"></div>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
          Nous plaçons la qualité des cadres, la cohérence des initiatives 
          et la pérennité des organisations au-dessus de la croissance rapide 
          ou de la visibilité immédiate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
        
        {values.map((val, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            
            <div className="text-[#47295C] mb-6">
              {val.icon}
            </div>
            
            <h3 className="font-bold text-sm text-[#47295C] mb-4">
              {val.title}
            </h3>
            
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[180px]">
              {val.desc}
            </p>
            
          </div>
        ))}

      </div>

    </section>
  );
}
