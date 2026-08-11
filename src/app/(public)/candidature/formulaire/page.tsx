import React from "react";
import CandidatureWizard from "@/components/features/candidature/CandidatureWizard";

export const metadata = {
  title: "Formulaire de Candidature - IN-CUBATOR",
  description: "Rejoignez le programme d'accompagnement de startups IN-CUBATOR",
};

export default function CandidatureFormPage() {
  return (
    <div className="min-h-screen bg-[#F9F7FA] font-sans" data-theme="light">
      <CandidatureWizard />
    </div>
  );
}
