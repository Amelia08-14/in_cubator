"use client";

import React, { useState } from "react";
import { FileUp, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminDoc {
  id: string;
  nom: string;
  date: string;
  url: string;
}

export default function AdminStartupDocuments({ startupId, initialDocuments }: { startupId: string, initialDocuments: AdminDoc[] }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<AdminDoc[]>(initialDocuments);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate S3 upload
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      console.log("Upload response:", uploadRes.status, uploadData);

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Erreur upload");
      }

      // Add record to database via the API we just updated for admins
      const docRes = await fetch(`/api/startups/${startupId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "AUTRE",
          fichierUrl: uploadData.data.url,
          visibleInvestisseurs: false,
        })
      });
      const docData = await docRes.json();
      console.log("Doc response:", docRes.status, docData);

      if (!docRes.ok) {
        throw new Error(docData.error?.message || "Erreur base de données");
      }

      // Optimistically add to list
      setDocuments([{
        id: docData.data.id,
        nom: uploadData.data.url.split('/').pop() || "Nouveau Document",
        date: new Date().toLocaleDateString("fr-FR"),
        url: uploadData.data.url
      }, ...documents]);

      setFile(null);
      router.refresh();
      
    } catch (error) {
      console.error("Full upload error:", error);
      alert(`Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={20} className="text-[#3719CA]" />
        <h2 className="text-xl font-bold text-gray-900">Partager un document avec la startup</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Les documents ajoutés ici apparaîtront directement sur le tableau de bord de la startup dans la section "Documents".
      </p>

      <form onSubmit={handleUpload} className="flex items-center gap-4 mb-6">
        <label className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <FileUp size={24} className={file ? "text-green-500" : "text-gray-400"} />
            <span className="text-sm font-medium text-gray-600">
              {file ? file.name : "Cliquez pour sélectionner un fichier"}
            </span>
          </div>
        </label>
        
        <button 
          type="submit" 
          disabled={!file || isUploading}
          className="px-6 py-4 bg-[#3719CA] text-white font-bold rounded-xl hover:bg-[#2b10ac] disabled:opacity-50 transition-colors flex items-center gap-2 h-full"
        >
          {isUploading ? "Envoi..." : (
            <>
              Partager <CheckCircle2 size={18} />
            </>
          )}
        </button>
      </form>

      {documents.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Documents partagés récemment</h3>
          <ul className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <li key={doc.id} className="py-3 flex items-center justify-between group hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#3719CA] transition-colors">{doc.nom}</p>
                    <p className="text-xs text-gray-500">{doc.date}</p>
                  </div>
                </div>
                <a 
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#3719CA] hover:underline"
                >
                  Ouvrir
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
