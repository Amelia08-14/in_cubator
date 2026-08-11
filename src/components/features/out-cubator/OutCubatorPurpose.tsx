import React from "react";
import { Puzzle, Network, Eye, Target } from "lucide-react";

export default function OutCubatorPurpose() {
  return (
    <section className="w-full max-w-[1100px] mx-auto px-8 py-16">
      
      <div className="flex flex-col items-center mb-16">
        <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-[#47295C] text-center mb-6">
          Notre raison d'être
        </h2>
        <div className="w-8 h-1 bg-[#47295C]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
        
        {/* Item 1 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F3EEF5] flex items-center justify-center mb-6 text-[#47295C]">
            <Puzzle size={28} />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#47295C] mb-4 min-h-[56px] flex items-center justify-center">
            Le problème adressé
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
            Out-Cubator a été créé pour répondre aux limites des dispositifs d'appui actuels, 
            souvent fragmentés, dépendants et orientés court terme.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F3EEF5] flex items-center justify-center mb-6 text-[#47295C]">
            <Network size={28} />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#47295C] mb-4 min-h-[56px] flex items-center justify-center">
            Notre rôle : <br /> Tête de réseau
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
            Nous agissons comme une tête de réseau qui conçoit des modèles d'incubation 
            reproductibles et relie les territoires, incubateurs et acteurs autour d'une gouvernance commune, 
            tout en préservant leur autonomie et leurs racines locales.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F3EEF5] flex items-center justify-center mb-6 text-[#47295C]">
            <Eye size={28} />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#47295C] mb-4 min-h-[56px] flex items-center justify-center">
            Notre vision <br /> long terme
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
            Construire des écosystèmes entrepreneuriaux solides, cohérents et pérennes, 
            capables de fonctionner de manière autonome dans la durée.
          </p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F3EEF5] flex items-center justify-center mb-6 text-[#47295C]">
            <Target size={28} />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#47295C] mb-4 min-h-[56px] flex items-center justify-center">
            Notre impact <br /> ultime
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
            Accompagner la création d'infrastructures entrepreneuriales résilientes, 
            génératrices d'un impact durable et porteuses de modèles de développement 
            transmissibles aux générations futures.
          </p>
        </div>

      </div>

    </section>
  );
}
