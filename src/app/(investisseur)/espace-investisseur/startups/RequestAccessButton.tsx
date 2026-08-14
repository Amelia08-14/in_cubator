"use client";

import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RequestAccessButton({ startupId }: { startupId: string }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      const res = await fetch("/api/acces-dealroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId })
      });

      if (res.ok) {
        alert("Demande d'accès envoyée avec succès.");
        router.refresh();
      } else {
        alert("Une erreur est survenue lors de la demande d'accès.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <button 
      onClick={handleRequest}
      disabled={isRequesting}
      className="flex items-center justify-center gap-2 w-full bg-[#47295C] text-white font-bold py-2 rounded-xl text-sm hover:bg-[#5a3875] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isRequesting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
      Demander accès Deal Room
    </button>
  );
}
