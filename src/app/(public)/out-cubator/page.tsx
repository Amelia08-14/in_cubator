import React from "react";
import OutCubatorHero from "@/components/features/out-cubator/OutCubatorHero";
import OutCubatorPurpose from "@/components/features/out-cubator/OutCubatorPurpose";
import OutCubatorMethodology from "@/components/features/out-cubator/OutCubatorMethodology";
import OutCubatorValues from "@/components/features/out-cubator/OutCubatorValues";
import OutCubatorCTA from "@/components/features/out-cubator/OutCubatorCTA";

export default function OutCubatorPage() {
  return (
    <div className="min-h-screen bg-white" data-theme="light">
      <OutCubatorHero />
      <OutCubatorPurpose />
      <OutCubatorMethodology />
      <OutCubatorValues />
      <OutCubatorCTA />
    </div>
  );
}
