import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatCards from "@/components/features/espace-mentor/dashboard/StatCards";
import PendingRequests from "@/components/features/espace-mentor/dashboard/PendingRequests";
import UpcomingAppointments from "@/components/features/espace-mentor/dashboard/UpcomingAppointments";
import BottomCTA from "@/components/features/espace-mentor/dashboard/BottomCTA";
import { Bell, ChevronDown } from "lucide-react";


export default async function MentorDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/connexion");
  }

  // Fetch this mentor's profile
  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      meetings: {
        orderBy: { createdAt: "desc" },
        include: {
          startup: {
            include: {
              user: true
            }
          },
          disponibilite: true
        }
      },
    },
  });

  const userName = session.user.email?.split("@")[0] || "Mentor";
  const initials = userName.substring(0, 2).toUpperCase();

  const meetings = mentorProfile?.meetings || [];
  const pendingMeetings = meetings.filter(m => m.statut === "DEMANDE"); // wait, STATUT is DEMANDE not EN_ATTENTE
  const upcomingMeetings = meetings.filter(m => m.statut === "CONFIRME" && m.disponibilite && new Date(m.disponibilite.dateDebut) >= new Date());
  
  // Sort upcoming meetings in memory
  upcomingMeetings.sort((a, b) => new Date(a.disponibilite!.dateDebut).getTime() - new Date(b.disponibilite!.dateDebut).getTime());

  // Stats
  const completedMeetings = meetings.filter(m => m.statut === "CONFIRME" || m.statut === "TERMINE");
  const uniqueStartups = new Set(completedMeetings.map(m => m.startupId)).size;
  const sessionsThisMonth = completedMeetings.filter(m => m.disponibilite && new Date(m.disponibilite.dateDebut).getMonth() === new Date().getMonth()).length;
  const totalHours = completedMeetings.length; // 1 hour per meeting simplified

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Top Header Section */}
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#47295C] flex items-center gap-2">
            Bonjour {userName} <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Voici un aperçu de votre activité de mentor.</p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={18} />
          </button>
          
          <div className="flex items-center gap-2 p-1.5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#f1edfa] text-[#47295C] font-bold flex items-center justify-center text-sm border border-[#eaddf7]">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <StatCards totalHours={totalHours} uniqueStartups={uniqueStartups} sessionsThisMonth={sessionsThisMonth} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingRequests requests={pendingMeetings} />
            <UpcomingAppointments appointments={upcomingMeetings} />
          </div>

          <BottomCTA />
        </div>
      </div>
    </div>
  );
}
