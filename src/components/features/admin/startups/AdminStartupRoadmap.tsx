"use client";

import React, { useState } from "react";
import { Plus, Check, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { realmFetch } from "@/lib/realm-fetch";
interface Task {
  id: string;
  titre: string;
  statut: string;
  dateEcheance: string | null;
}

interface Objective {
  id: string;
  titre: string;
  description: string | null;
  dateEcheance: string | null;
  statut: string;
  taches: Task[];
}

interface Props {
  startupId: string;
  initialObjectifs: Objective[];
}

export default function AdminStartupRoadmap({ startupId, initialObjectifs }: Props) {
  const router = useRouter();
  const [objectifs, setObjectifs] = useState<Objective[]>(initialObjectifs);
  const [isAddingObj, setIsAddingObj] = useState(false);
  const [newObjTitre, setNewObjTitre] = useState("");
  const [addingTaskTo, setAddingTaskTo] = useState<string | null>(null);
  const [newTaskTitre, setNewTaskTitre] = useState("");

  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjTitre.trim()) return;

    try {
      const res = await realmFetch(`/api/startups/${startupId}/objectifs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: newObjTitre })
      });
      const data = await res.json();
      if (res.ok) {
        setObjectifs([{ ...data.data, taches: [] }, ...objectifs]);
        setNewObjTitre("");
        setIsAddingObj(false);
        router.refresh();
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      alert("Erreur réseau");
    }
  };

  const handleAddTask = async (e: React.FormEvent, objectifId: string) => {
    e.preventDefault();
    if (!newTaskTitre.trim()) return;

    try {
      const res = await realmFetch(`/api/startups/${startupId}/objectifs/${objectifId}/taches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: newTaskTitre })
      });
      const data = await res.json();
      if (res.ok) {
        setObjectifs(objectifs.map(obj => 
          obj.id === objectifId 
            ? { ...obj, taches: [...obj.taches, data.data] }
            : obj
        ));
        setNewTaskTitre("");
        setAddingTaskTo(null);
        router.refresh();
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      alert("Erreur réseau");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Roadmap & Objectifs</h2>
          <p className="text-sm text-gray-500">Définissez les étapes clés que cette startup doit accomplir.</p>
        </div>
        <button 
          onClick={() => setIsAddingObj(!isAddingObj)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3719CA] text-white hover:bg-[#2b10ac] rounded-lg text-sm font-bold transition-colors"
        >
          <Plus size={16} />
          Nouvel objectif
        </button>
      </div>

      {isAddingObj && (
        <form onSubmit={handleAddObjective} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Titre de l'objectif (ex: Finaliser le MVP)" 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3719CA]/20"
            value={newObjTitre}
            onChange={(e) => setNewObjTitre(e.target.value)}
            autoFocus
          />
          <button type="submit" className="px-4 py-2 bg-[#3719CA] text-white rounded-lg text-sm font-bold hover:bg-[#2b10ac]">
            Enregistrer
          </button>
          <button type="button" onClick={() => setIsAddingObj(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium">
            Annuler
          </button>
        </form>
      )}

      {objectifs.length === 0 && !isAddingObj ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm">Aucun objectif assigné pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {objectifs.map((obj) => (
            <div key={obj.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              
              {/* Header de l'objectif */}
              <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{obj.titre}</h3>
                  {obj.description && <p className="text-sm text-gray-500 mt-1">{obj.description}</p>}
                </div>
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                  {obj.statut === "TERMINE" ? (
                    <span className="text-green-600 flex items-center gap-1"><Check size={14} /> VALIDÉ</span>
                  ) : obj.statut.replace("_", " ")}
                </div>
              </div>

              {/* Tâches */}
              <div className="p-2 flex-1">
                {obj.taches.length === 0 ? (
                  <p className="text-sm text-gray-400 p-4 text-center italic">Aucune tâche assignée à cet objectif.</p>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {obj.taches.map(tache => {
                      const isDone = tache.statut === "TERMINE";
                      return (
                        <li key={tache.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg group">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isDone ? "bg-green-500 border-green-500 text-white" : "border-gray-300 bg-white"
                          }`}>
                            {isDone && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className={`text-sm font-medium ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {tache.titre}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Ajouter une tâche */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                {addingTaskTo === obj.id ? (
                  <form onSubmit={(e) => handleAddTask(e, obj.id)} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Nouvelle tâche..." 
                      className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#3719CA]"
                      value={newTaskTitre}
                      onChange={(e) => setNewTaskTitre(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="text-xs font-bold text-white bg-[#3719CA] px-3 py-1.5 rounded-md">
                      Ajouter
                    </button>
                    <button type="button" onClick={() => setAddingTaskTo(null)} className="text-xs font-medium text-gray-500 px-2 py-1.5">
                      Annuler
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setAddingTaskTo(obj.id)}
                    className="flex items-center gap-1 text-sm font-bold text-[#3719CA] hover:text-[#2b10ac] px-2 py-1"
                  >
                    <Plus size={14} />
                    Ajouter une tâche
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
