"use client";

import React, { useState } from "react";
import { Upload, FileText, Check, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { Document } from "@prisma/client";

interface Props {
  initialDocuments: Document[];
  initialAccessRequests?: any[];
  startupId: string;
}

export default function DealRoomClient({ initialDocuments, initialAccessRequests = [], startupId }: Props) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [accessRequests, setAccessRequests] = useState<any[]>(initialAccessRequests);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("PITCH_DECK");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Upload file to simulated S3
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadRes.json();
      
      if (!uploadRes.ok || uploadJson.error) {
        throw new Error(uploadJson.error?.message || "Upload failed");
      }

      const fileUrl = uploadJson.data.url;

      // 2. Create document record in DB
      const docRes = await fetch(`/api/startups/${startupId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: uploadType,
          fichierUrl: fileUrl,
          visibleInvestisseurs: false,
        }),
      });

      const docJson = await docRes.json();
      if (docRes.ok && !docJson.error) {
        setDocuments(prev => [docJson.data, ...prev]);
        alert("Document ajouté avec succès !");
      } else {
        throw new Error(docJson.error?.message || "Erreur lors de la création du document");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Une erreur est survenue lors de l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleVisibility = async (docId: string, currentStatus: boolean) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, visibleInvestisseurs: !currentStatus } : d));
    try {
      await fetch(`/api/startups/${startupId}/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibleInvestisseurs: !currentStatus })
      });
    } catch (error) {
      console.error(error);
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, visibleInvestisseurs: currentStatus } : d));
    }
  };

  const handleRequestUpdate = async (requestId: string, statut: 'ACCORDE' | 'REFUSE') => {
    try {
      const res = await fetch(`/api/acces-dealroom/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut })
      });
      if (res.ok) {
        setAccessRequests(prev => prev.map(r => r.id === requestId ? { ...r, statut } : r));
      } else {
        alert("Une erreur est survenue.");
      }
    } catch (err) {
      alert("Une erreur est survenue.");
    }
  };

  const documentTypes = [
    { value: "PITCH_DECK", label: "Pitch Deck" },
    { value: "BUSINESS_PLAN", label: "Business Plan" },
    { value: "KPI_REPORT", label: "Rapport KPI" },
    { value: "FINANCIER", label: "Données Financières" },
    { value: "AUTRE", label: "Autre Document" },
  ];

  const [activeTab, setActiveTab] = useState<"mes-documents" | "acces">("mes-documents");

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-[#f8f9fa] relative">
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Deal Room Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#47295C] mb-2 flex items-center gap-2">
              <Lock size={24} className="text-[#964594]" />
              Deal Room
            </h1>
            <p className="text-sm text-gray-500">
              Gérez vos documents sensibles et contrôlez leur visibilité auprès des investisseurs.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button 
              onClick={() => setActiveTab("mes-documents")}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "mes-documents" 
                  ? "border-[#964594] text-[#47295C]" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Mes documents
            </button>
            <button 
              onClick={() => setActiveTab("acces")}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "acces" 
                  ? "border-[#964594] text-[#47295C]" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Accès investisseurs
              {accessRequests.filter(r => r.statut === 'DEMANDE').length > 0 && (
                <span className="bg-[#47295C] text-white text-[10px] px-2 py-0.5 rounded-full">
                  {accessRequests.filter(r => r.statut === 'DEMANDE').length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          {activeTab === "mes-documents" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Upload Form */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Ajouter un document</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Type de document</label>
                      <select 
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#47295C] focus:outline-none"
                      >
                        {documentTypes.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Fichier (PDF, DOCX)</label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                        <input 
                          type="file" 
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          accept=".pdf,.doc,.docx,.xlsx"
                        />
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 text-[#47295C] animate-spin mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {isUploading ? "Upload en cours..." : "Cliquez ou glissez un fichier ici"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-sm font-bold text-gray-900">Vos documents ({documents.length})</h2>
                  </div>
                  
                  {documents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      Aucun document n'a été ajouté à votre Deal Room.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {documents.map((doc) => (
                        <li key={doc.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{doc.type.replace("_", " ")}</h4>
                              <a href={doc.fichierUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                                Voir le fichier
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-gray-500 mb-1">Visible Investisseurs</span>
                              <button 
                                onClick={() => toggleVisibility(doc.id, doc.visibleInvestisseurs)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${doc.visibleInvestisseurs ? 'bg-[#47295C]' : 'bg-gray-300'}`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${doc.visibleInvestisseurs ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              {accessRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <h3 className="font-bold text-[#47295C] text-lg mb-2">Accès investisseurs</h3>
                  <p className="text-gray-500 text-sm">Aucun investisseur n'a encore demandé accès à votre Deal Room.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-sm font-bold text-gray-900">Demandes d'accès</h2>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {accessRequests.map((req) => (
                      <li key={req.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-bold text-gray-900 text-sm mb-1">
                            {req.investisseur?.organisation || `Investisseur (ID: ${req.investisseurId.substring(0, 6)}...)`}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span>Email : {req.investisseur?.user?.email || 'N/A'}</span>
                            <span>•</span>
                            <span>Date : {new Date(req.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                        {req.statut === 'DEMANDE' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleRequestUpdate(req.id, 'ACCORDE')}
                              className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-bold border border-emerald-200 transition-colors"
                            >
                              Accepter
                            </button>
                            <button 
                              onClick={() => handleRequestUpdate(req.id, 'REFUSE')}
                              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold border border-red-200 transition-colors"
                            >
                              Refuser
                            </button>
                          </div>
                        ) : (
                          <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                            req.statut === 'ACCORDE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {req.statut === 'ACCORDE' ? 'Accès accordé' : 'Accès refusé'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
