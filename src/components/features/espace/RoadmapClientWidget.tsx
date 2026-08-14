"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, Clock, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Tache {
  id: string;
  titre: string;
  statut: "A_FAIRE" | "EN_COURS" | "TERMINE" | "EN_RETARD";
}

interface Objectif {
  id: string;
  titre: string;
  statut: string;
  taches: Tache[];
}

export default function RoadmapClientWidget({ startupId }: { startupId: string }) {
  const router = useRouter();
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [submittingObjId, setSubmittingObjId] = useState<string | null>(null);

  useEffect(() => {
    fetchObjectifs();
  }, [startupId]);

  const fetchObjectifs = async () => {
    try {
      const res = await fetch(`/api/startups/${startupId}/objectifs`);
      const json = await res.json();
      if (json.data) {
        setObjectifs(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitObjective = async (objectifId: string) => {
    setSubmittingObjId(objectifId);
    try {
      const res = await fetch(`/api/startups/${startupId}/objectifs/${objectifId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "TERMINE" })
      });
      const json = await res.json();
      if (json.data) {
        setObjectifs(prev => prev.map(obj => 
          obj.id === objectifId ? { ...obj, statut: "TERMINE" } : obj
        ));
        router.refresh(); // Tell Next.js to re-render Server Components (like Header)
      }
    } catch (error) {
      console.error("Failed to submit objective", error);
    } finally {
      setSubmittingObjId(null);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    setUpdatingTaskId(taskId);
    const newStatus = currentStatus === "TERMINE" ? "EN_COURS" : "TERMINE";

    try {
      const res = await fetch(`/api/startups/${startupId}/taches/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus })
      });
      const json = await res.json();
      if (json.data) {
        // Update local state
        setObjectifs(prev => prev.map(obj => ({
          ...obj,
          taches: obj.taches.map(t => t.id === taskId ? { ...t, statut: newStatus } : t)
        })));
        router.refresh(); // Tell Next.js to re-render Server Components (like Header)
      }
    } catch (error) {
      console.error("Failed to update task", error);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col min-h-[300px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#47295C]" />
        <p className="mt-4 text-sm text-gray-500">Chargement de votre roadmap...</p>
      </div>
    );
  }

  if (objectifs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Roadmap & Objectifs</h3>
        <p className="text-gray-500 text-sm">Aucun objectif assigné pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-[#47295C] mb-1">Roadmap & Objectifs</h3>
        <p className="text-xs text-gray-500">
          Suivez vos tâches actives et marquez-les comme terminées pour progresser.
        </p>
      </div>
      <div className="p-6 space-y-6">
        {objectifs.map((objectif) => {
          const completedCount = objectif.taches.filter(t => t.statut === "TERMINE").length;
          const totalCount = objectif.taches.length;
          const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
          const isObjDone = objectif.statut === "TERMINE";

          return (
            <div key={objectif.id} className={`border rounded-xl p-5 transition-colors ${isObjDone ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h4 className={`font-bold ${isObjDone ? 'text-green-700' : 'text-gray-900'}`}>{objectif.titre}</h4>
                  {isObjDone && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 uppercase">
                      Validé
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {progress === 100 && !isObjDone && (
                    <button 
                      onClick={() => submitObjective(objectif.id)}
                      disabled={submittingObjId === objectif.id}
                      className="px-4 py-1.5 bg-[#3719CA] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#2b10ac] disabled:opacity-50 transition-all flex items-center gap-1"
                    >
                      {submittingObjId === objectif.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle size={14} />}
                      Soumettre
                    </button>
                  )}
                  <span className={`text-xs font-bold ${isObjDone ? 'text-green-600' : 'text-[#47295C]'}`}>{progress}%</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mb-5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isObjDone ? 'bg-green-500' : 'bg-[#3719CA]'}`}
                  style={{ width: `${progress}%` }} 
                />
              </div>

              <div className="space-y-3">
                {objectif.taches.map(tache => {
                  const isCompleted = tache.statut === "TERMINE";
                  const isUpdating = updatingTaskId === tache.id;

                  return (
                    <div 
                      key={tache.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isCompleted ? 'bg-white border-green-100' : 'bg-white border-gray-100 hover:border-gray-300'}`}
                    >
                      <button 
                        onClick={() => toggleTaskStatus(tache.id, tache.statut)}
                        disabled={isUpdating}
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                          isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        } ${isCompleted ? 'bg-green-500 text-white' : 'border-2 border-gray-300 text-transparent hover:border-[#47295C]'}`}
                      >
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin text-gray-400" /> : <Check size={12} strokeWidth={3} />}
                      </button>
                      <span className={`text-sm font-medium transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {tache.titre}
                      </span>
                    </div>
                  );
                })}
                {totalCount === 0 && (
                  <p className="text-xs text-gray-400 italic">Aucune tâche pour cet objectif.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
