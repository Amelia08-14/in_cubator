"use client";

import React, { useState } from "react";
import Header from "@/components/features/espace/Header";
import { BookOpen, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ResourceCard, { ResourceItem } from "@/components/features/espace/bibliotheque/ResourceCard";

const mockResources: ResourceItem[] = [
  {
    id: "1",
    title: "Modèle de Business Plan",
    description: "Modèle complet de business plan adapté aux startups en santé.",
    category: "Finance",
    categoryClass: "text-purple-600 bg-purple-50",
    fileType: "pdf",
    size: "1.2 MB",
    date: "12/05/2024"
  },
  {
    id: "2",
    title: "Business Model Canvas",
    description: "Template du Business Model Canvas pour structurer votre modèle d'affaires.",
    category: "Stratégie",
    categoryClass: "text-blue-600 bg-blue-50",
    fileType: "docx",
    size: "450 KB",
    date: "10/05/2024"
  },
  {
    id: "3",
    title: "Modèle de Pitch Deck",
    description: "Présentation prête à l'emploi pour convaincre vos investisseurs.",
    category: "Pitch",
    categoryClass: "text-orange-600 bg-orange-50",
    fileType: "pptx",
    size: "2.1 MB",
    date: "08/05/2024"
  },
  {
    id: "4",
    title: "Prévisions Financières",
    description: "Modèle Excel pour vos prévisions financières et analyse de rentabilité.",
    category: "Finance",
    categoryClass: "text-green-600 bg-green-50",
    fileType: "xlsx",
    size: "850 KB",
    date: "05/05/2024"
  },
  {
    id: "5",
    title: "Étude de Marché – Santé",
    description: "Guide pour réaliser une étude de marché dans le secteur de la santé.",
    category: "Market",
    categoryClass: "text-pink-600 bg-pink-50",
    fileType: "pdf",
    size: "1.8 MB",
    date: "02/05/2024"
  },
  {
    id: "6",
    title: "Contrat de Confidentialité (NDA)",
    description: "Modèle de NDA standard pour protéger vos informations sensibles.",
    category: "Juridique",
    categoryClass: "text-gray-600 bg-gray-100",
    fileType: "docx",
    size: "300 KB",
    date: "30/04/2024"
  },
  {
    id: "7",
    title: "Guide Réglementaire – Pharma",
    description: "Guide des exigences réglementaires pour les produits pharmaceutiques en Algérie.",
    category: "Juridique",
    categoryClass: "text-gray-600 bg-gray-100",
    fileType: "pdf",
    size: "2.4 MB",
    date: "28/04/2024"
  },
  {
    id: "8",
    title: "Modèle de Contrat de Travail",
    description: "Modèle de contrat de travail adapté aux startups.",
    category: "RH",
    categoryClass: "text-blue-600 bg-blue-50",
    fileType: "docx",
    size: "220 KB",
    date: "25/04/2024"
  }
];

const filters = ["Tous", "Finance", "Juridique / Legal", "Marketing", "Tech", "Ressources Humaines", "Opérations"];

export default function BibliothequePage() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "Tous" || 
                          (activeFilter === "Juridique / Legal" && resource.category === "Juridique") ||
                          (activeFilter === "Ressources Humaines" && resource.category === "RH") ||
                          resource.category === activeFilter;
                          
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-[#f8f9fa] relative">
      <Header />
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#964594]/20 flex items-center justify-center shadow-sm shrink-0">
              <BookOpen size={28} className="text-[#47295C]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#47295C] mb-1">Bibliothèque</h1>
              <p className="text-sm text-gray-500 max-w-2xl">
                Accédez aux modèles, guides et documents juridiques mis à disposition par l'incubateur pour vous accompagner à chaque étape de votre projet.
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
            
            <div className="relative flex-1 w-full">
              <input 
                type="text" 
                placeholder="Rechercher un document, un modèle, un guide..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#964594]/30 focus:border-[#964594] transition-all shadow-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex flex-col gap-1.5 w-full md:w-48">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Catégorie</span>
                <button className="flex items-center justify-between gap-2 px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-[#964594]/50 hover:bg-[#964594]/5 transition-colors w-full shadow-sm">
                  Toutes les catégories
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-48">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Trier par</span>
                <button className="flex items-center justify-between gap-2 px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 hover:border-[#964594]/50 hover:bg-[#964594]/5 transition-colors w-full shadow-sm">
                  Les plus récents
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                  activeFilter === filter 
                    ? "bg-[#47295C] text-white border-[#47295C]" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#964594]/30 hover:text-[#47295C]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700">
              {filteredResources.length} ressources disponibles
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
            
            {filteredResources.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                Aucune ressource ne correspond à votre recherche.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <span className="text-xs text-gray-500 font-medium">
              Affichage 1 à {filteredResources.length} sur 24 ressources
            </span>
            
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded bg-[#47295C] text-white text-sm font-bold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="w-8 h-8 rounded border border-gray-200 bg-white text-gray-600 text-sm font-bold flex items-center justify-center hover:bg-gray-50">
                2
              </button>
              <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Ligne par page</span>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-bold text-gray-700 bg-white">
                12
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
