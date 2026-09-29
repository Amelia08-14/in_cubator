import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Star, Calendar, Clock, MapPin, Briefcase, Globe, Info } from "lucide-react";


export default async function AdminMentorDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth("admin");
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "GESTIONNAIRE")) {
    redirect("/admin/connexion");
  }
  
  const { id } = await params;

  const mentor = await prisma.mentorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      disponibilites: true,
      meetings: true
    }
  });

  if (!mentor) {
    redirect("/admin/mentors");
  }

  // Parse JSON fields
  const secteurs = Array.isArray(mentor.secteurs) ? mentor.secteurs : (typeof mentor.secteurs === 'string' ? JSON.parse(mentor.secteurs) : []);
  const expertise = Array.isArray(mentor.expertise) ? mentor.expertise : (typeof mentor.expertise === 'string' ? JSON.parse(mentor.expertise) : []);
  const langues = Array.isArray(mentor.langues) ? mentor.langues : (typeof mentor.langues === 'string' ? JSON.parse(mentor.langues) : []);

  const totalMeetings = mentor.meetings.length;
  const totalHours = totalMeetings * 1; // Assuming 1 hour per meeting for simplicity

  const displayName = mentor.nomComplet || mentor.user.email.split('@')[0];

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#f8f9fa]">
      <header className="bg-white px-8 py-6 border-b border-gray-200 flex flex-col gap-4 shadow-sm sticky top-0 z-20">
        <Link href="/admin/mentors" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#3719CA] transition-colors">
          <ChevronLeft size={16} />
          Retour aux mentors
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#47295C] to-[#3719CA] text-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${mentor.actif ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {mentor.actif ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-700 mt-1">{mentor.titreFonction || "Mentor Expert"}</div>
              <p className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {mentor.user.email}</span>
                {mentor.linkedinUrl && (
                  <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0077B5] hover:underline">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn
                  </a>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Note</span>
              <div className="flex items-center gap-1 font-bold text-gray-900">
                <Star size={16} className="fill-orange-400 text-orange-400" />
                {mentor.noteMoyenne} / 5
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Heures mentorées</span>
              <div className="flex items-center gap-1 font-bold text-gray-900">
                <Clock size={16} className="text-[#3719CA]" />
                {totalHours} h
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Bio section */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#47295C]" />
              Biographie & Profil
            </h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              {mentor.bio ? (
                <p className="whitespace-pre-wrap leading-relaxed">{mentor.bio}</p>
              ) : (
                <p className="italic text-gray-400">Aucune biographie fournie.</p>
              )}
            </div>
          </section>

          {/* Tags section */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-[#47295C]" />
              Compétences & Secteurs
            </h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-[11px]">Expertise principale</h3>
                <div className="flex flex-wrap gap-2">
                  {expertise.length > 0 ? expertise.map((exp: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-[#f1edfa] text-[#47295C] border border-[#eaddf7] rounded-lg text-xs font-medium">
                      {exp}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-400 italic">Non spécifié</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-[11px]">Secteurs de prédilection</h3>
                <div className="flex flex-wrap gap-2">
                  {secteurs.length > 0 ? secteurs.map((secteur: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium">
                      {secteur}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-400 italic">Non spécifié</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Meta info */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Informations complémentaires</h2>
             
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Globe size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Langues parlées</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {langues.length > 0 ? langues.join(", ") : "Non spécifié"}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Membre depuis</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {mentor.user.createdAt.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Info size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tarif indicatif</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {mentor.tarifIndicatif || "Bénévolat / Non spécifié"}
                    </p>
                  </div>
                </li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
