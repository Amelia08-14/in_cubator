"use client";

import React, { useEffect, useState } from "react";
import { useCandidatureFormStore } from "@/lib/store/candidatureStore";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

import Step1Identity from "./steps/Step1Identity";
import Step2Team from "./steps/Step2Team";
import Step3Sector from "./steps/Step3Sector";
import Step4Details from "./steps/Step4Details";
import Step5Summary from "./steps/Step5Summary";

export default function CandidatureWizard() {
  const { currentStep } = useCandidatureFormStore();
  
  // Hydration fix for Zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Identity />;
      case 2:
        return <Step2Team />;
      case 3:
        return <Step3Sector />;
      case 4:
        return <Step4Details />;
      case 5:
        return <Step5Summary />;
      default:
        return <Step1Identity />;
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  const stepsList = [
    { num: 1, title: "Identité du projet et de la startup" },
    { num: 2, title: "Équipe" },
    { num: 3, title: "Secteur et stade d'avancement" },
    { num: 4, title: "Description, problème résolu, besoins exprimés" },
    { num: 5, title: "Récapitulatif + soumission" },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto min-h-screen pt-32 pb-24 px-4 sm:px-8">
      
      <Link href="/candidature" className="inline-flex items-center gap-2 text-sm text-[#47295C] hover:text-[#964594] font-medium mb-8 transition-colors">
        <ArrowLeft size={16} />
        Retour à la page candidature
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Sidebar (Progress & Steps) */}
        <div className="w-full lg:w-[320px] shrink-0 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden hidden md:block">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9F7FA] rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          
          <h2 className="text-2xl font-bold text-[#47295C] mb-4">Candidature intelligente</h2>
          <p className="text-sm text-gray-500 mb-10">
            Répondez à quelques questions pour nous permettre de mieux comprendre votre projet.
          </p>

          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-100 -z-10"></div>
            
            <ul className="space-y-8">
              {stepsList.map((step) => {
                const isActive = step.num === currentStep;
                const isPast = step.num < currentStep;
                
                return (
                  <li key={step.num} className="flex gap-4 items-start">
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-300 ${isActive || isPast ? 'bg-[#47295C] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                      {step.num}
                    </div>
                    <span className={`text-sm font-bold pt-1.5 leading-tight transition-colors duration-300 ${isActive ? 'text-[#47295C]' : isPast ? 'text-[#47295C]/70' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-12 p-4 bg-[#F9F7FA] rounded-xl flex items-start gap-3">
            <ShieldCheck className="text-[#964594] shrink-0" size={20} />
            <p className="text-xs text-[#47295C] font-medium leading-relaxed">
              Vos données sont sécurisées et confidentielles.
            </p>
          </div>
        </div>

        {/* Right Content (The Form) */}
        <div className="flex-1 w-full flex flex-col">
          
          {/* Top Progress Bar */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[#47295C]">Étape {currentStep} sur 5</span>
              <span className="text-sm font-bold text-gray-500">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="mb-8" />
            
            {/* Step Form Rendering */}
            {renderStep()}
          </div>

          {/* Adaptive Message Footer */}
          <div className="bg-[#F9F7FA] p-6 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#964594] shrink-0 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#47295C] text-sm mb-1">Cette candidature intelligente s'adapte à votre projet</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Nous vous poserons uniquement les questions pertinentes en fonction de votre secteur et de votre stade d'avancement.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
