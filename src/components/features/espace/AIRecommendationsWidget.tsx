import React from "react";
import { Sparkles, Star } from "lucide-react";

interface Recommendation {
  id: string;
  name: string;
  type: string;
  typeColor: string;
  image: string;
  reason: string;
}

const mockRecommendations: Recommendation[] = [];

export default function AIRecommendationsWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-[#47295C]" />
        <h2 className="text-lg font-bold text-[#47295C]">C. Recommandations IA</h2>
      </div>

      {mockRecommendations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-sm text-gray-500">Aucune recommandation disponible pour le moment.</p>
          <p className="text-xs text-gray-400 mt-1">L'IA analysera votre profil pour vous proposer des mentors et partenaires pertinents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {mockRecommendations.map(rec => (
            <div key={rec.id} className="border border-gray-100 rounded-xl p-5 flex flex-col hover:border-[#964594]/30 hover:shadow-md transition-all group bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{rec.name}</h3>
                  <p className={`text-xs ${rec.typeColor}`}>{rec.type}</p>
                </div>
              </div>
              <button className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Star size={16} />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-1">
              {rec.reason}
            </p>

            <button className="w-full py-2 rounded-lg border border-[#964594]/20 text-[#964594] text-xs font-bold hover:bg-[#964594] hover:text-white transition-colors">
              Voir le profil
            </button>
          </div>
        ))}
      </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="text-xs font-bold text-[#964594] hover:text-[#47295C] transition-colors flex items-center gap-1 group">
          Voir toutes les recommandations
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
