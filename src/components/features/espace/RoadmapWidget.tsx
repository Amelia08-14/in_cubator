import React from "react";
import { MoreVertical, CheckCircle2 } from "lucide-react";

interface Objective {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
}

interface Column {
  id: string;
  title: string;
  count: number;
  items: Objective[];
}

const mockColumns: Column[] = [
  {
    id: "todo",
    title: "À faire",
    count: 3,
    items: [
      {
        id: "1",
        title: "Étude de marché",
        description: "Analyser le marché cible et la concurrence.",
        tag: "Stratégie",
        tagColor: "text-pink-600 bg-pink-50",
      },
      {
        id: "2",
        title: "Définir le MVP",
        description: "Lister les fonctionnalités clés pour la V1.",
        tag: "Produit",
        tagColor: "text-blue-600 bg-blue-50",
      },
      {
        id: "3",
        title: "Plan marketing",
        description: "Élaborer la stratégie d'acquisition.",
        tag: "Marketing",
        tagColor: "text-purple-600 bg-purple-50",
      }
    ]
  },
  {
    id: "inprogress",
    title: "En cours",
    count: 2,
    items: [
      {
        id: "4",
        title: "Développement MVP",
        description: "Développer les fonctionnalités clés du produit.",
        tag: "Produit",
        tagColor: "text-orange-600 bg-orange-50",
      },
      {
        id: "5",
        title: "Constitution de l'équipe",
        description: "Recruter les premiers membres clés.",
        tag: "Opérations",
        tagColor: "text-blue-600 bg-blue-50",
      }
    ]
  },
  {
    id: "review",
    title: "En revue",
    count: 2,
    items: [
      {
        id: "6",
        title: "Modèle économique",
        description: "Valider les hypothèses et le modèle de revenus.",
        tag: "Stratégie",
        tagColor: "text-pink-600 bg-pink-50",
      },
      {
        id: "7",
        title: "Design review",
        description: "Relecture des écrans et parcours utilisateur.",
        tag: "Produit",
        tagColor: "text-blue-600 bg-blue-50",
      }
    ]
  },
  {
    id: "done",
    title: "Terminé",
    count: 3,
    items: [
      {
        id: "8",
        title: "Vision & Mission",
        description: "Définir la vision, la mission et les valeurs.",
        tag: "Stratégie",
        tagColor: "text-pink-600 bg-pink-50",
      },
      {
        id: "9",
        title: "Business plan initial",
        description: "Rédiger la première version du business plan.",
        tag: "Stratégie",
        tagColor: "text-pink-600 bg-pink-50",
      },
      {
        id: "10",
        title: "Choix du stack tech",
        description: "Sélectionner les technologies.",
        tag: "Produit",
        tagColor: "text-teal-600 bg-teal-50",
      }
    ]
  }
];

export default function RoadmapWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-lg font-bold text-[#47295C]">A. Feuille de route (objectifs)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {mockColumns.map((col) => (
          <div key={col.id} className="bg-gray-50/50 rounded-xl p-3 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-sm text-gray-700">{col.title}</h3>
              <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                {col.count}
              </span>
            </div>
            
            <div className="space-y-3 flex-1">
              {col.items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#47295C] text-sm pr-6 leading-tight flex items-center gap-1.5">
                      {item.title}
                      {col.id === "done" && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                    </h4>
                    <button className="text-gray-400 hover:text-gray-600 absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
