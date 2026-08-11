import React from "react";
import Header from "@/components/features/espace/Header";
import RoadmapWidget from "@/components/features/espace/RoadmapWidget";
import TaskListWidget from "@/components/features/espace/TaskListWidget";
import AIRecommendationsWidget from "@/components/features/espace/AIRecommendationsWidget";
import DocumentsWidget from "@/components/features/espace/DocumentsWidget";

export default function EspaceDashboard() {
  return (
    <div className="flex flex-col min-h-screen pb-12">
      <Header />
      
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Top Row */}
          <div className="lg:col-span-8">
            <RoadmapWidget />
          </div>
          <div className="lg:col-span-4">
            <TaskListWidget />
          </div>

          {/* Bottom Row */}
          <div className="lg:col-span-7">
            <AIRecommendationsWidget />
          </div>
          <div className="lg:col-span-5">
            <DocumentsWidget />
          </div>

        </div>
      </div>
    </div>
  );
}
