import React from "react";
import { Activity, Heart, Leaf, Pill, Wheat, Waves, UserCircle2, Sprout } from "lucide-react";
import { Sector } from "@/components/features/vitrine/StartupDirectoryCard";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string; // url or placeholder
  linkedin: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
}

export interface AwardItem {
  id: string;
  title: string;
  description: string;
}

export interface FundingDetails {
  raisedAmount: string;
  round: string;
  year: string;
  investors: string;
  nextRound: {
    type: string;
    goal: string;
    date: string;
  };
  progressPercent: number; // 0-100
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface StartupProfile {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string[];
  sector: Sector;
  stage: "Ideation" | "Seed" | "Early Stage" | "Growth";
  logoIcon: React.ReactNode;
  
  // Profile specific
  foundedYear: string;
  location: string;
  website: string;
  linkedin: string;
  twitter?: string;
  team: TeamMember[];
  needs: string[];
  news: NewsItem[];
  videoThumbnail: string; 
  awards: AwardItem[];
  funding: FundingDetails;
  contact: ContactInfo;
}

export const startupsData: StartupProfile[] = [
  {
    id: 1,
    slug: "cardiosense",
    name: "CardioSense",
    shortDescription: "Solution d'IA pour la détection précoce des maladies cardiovasculaires.",
    longDescription: [
      "L'IA au service de la détection précoce des maladies cardiovasculaires.",
      "CardioSense développe une solution basée sur l'intelligence artificielle qui analyse les données cardiaques pour détecter précocement les maladies cardiovasculaires et améliorer la prise en charge des patients."
    ],
    sector: "Health Tech",
    stage: "Seed",
    logoIcon: <Heart className="text-[#964594]" size={48} />, // Increased size for profile
    foundedYear: "2023",
    location: "Alger, Algérie",
    website: "https://cardiosense.dz",
    linkedin: "https://linkedin.com/company/cardiosense",
    team: [
      { id: "1", name: "Yacine B.", role: "Co-fondateur & CEO", image: "/placeholder-avatar.png", linkedin: "#" },
      { id: "2", name: "Inès K.", role: "Co-fondatrice & CTO", image: "/placeholder-avatar.png", linkedin: "#" },
      { id: "3", name: "Karim M.", role: "Lead Data Scientist", image: "/placeholder-avatar.png", linkedin: "#" },
      { id: "4", name: "Lamia D.", role: "Responsable Produit", image: "/placeholder-avatar.png", linkedin: "#" },
    ],
    needs: [
      "Financement pour accélérer le développement clinique et réglementaire",
      "Partenariats avec des hôpitaux et cliniques",
      "Accès à des datasets médicaux de qualité",
      "Accompagnement en go-to-market"
    ],
    news: [
      { id: "n1", title: "CardioSense sélectionnée au programme IN-CUBATOR", date: "12 mai 2024" },
      { id: "n2", title: "Partenariat signé avec l'hôpital Mustapha", date: "28 mars 2024" },
      { id: "n3", title: "Participation au salon Santexpo Paris", date: "16 janvier 2024" }
    ],
    videoThumbnail: "/placeholder-video.jpg", // Will use a colored div fallback
    awards: [
      { id: "a1", title: "1er prix - Innov'Health 2024", description: "Concours national de l'innovation en santé" },
      { id: "a2", title: "Prix IA for Good 2023", description: "Catégorie Santé" },
      { id: "a3", title: "Top 10 - African HealthTech Startups", description: "Classement 2023" }
    ],
    funding: {
      raisedAmount: "350K €",
      round: "Seed Round",
      year: "2024",
      investors: "InnovInvest, SANAD Fund, Business Angels Network",
      nextRound: {
        type: "Pre-Series A",
        goal: "1.5M €",
        date: "T1 2025"
      },
      progressPercent: 65
    },
    contact: {
      email: "contact@cardiosense.dz",
      phone: "+213 555 12 34 56",
      location: "Alger, Algérie"
    }
  },
  // Dummy data for the rest so the directory doesn't break
  {
    id: 2,
    slug: "medflow",
    name: "MedFlow",
    shortDescription: "Plateforme de gestion intelligente des flux patients pour les établissements de santé.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "MedTech",
    stage: "Growth",
    logoIcon: <Activity className="text-[#964594]" size={48} />,
    foundedYear: "2022", location: "Oran, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  },
  {
    id: 3,
    slug: "bioleaf",
    name: "BioLeaf",
    shortDescription: "Biotechnologies au service de traitements naturels et durables.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "Biotechnologies",
    stage: "Early Stage",
    logoIcon: <Leaf className="text-[#47295C]" size={48} />,
    foundedYear: "2023", location: "Alger, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  },
  {
    id: 4,
    slug: "pharmalink",
    name: "PharmaLink",
    shortDescription: "Marketplace B2B connectant pharmacies, laboratoires et fournisseurs.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "Pharmacy",
    stage: "Seed",
    logoIcon: <Pill className="text-[#964594]" size={48} />,
    foundedYear: "2024", location: "Alger, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  },
  {
    id: 5,
    slug: "agricare",
    name: "AgriCare",
    shortDescription: "Capteurs IoT et analytics pour une agriculture plus productive et durable.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "AgriTech",
    stage: "Early Stage",
    logoIcon: <Wheat className="text-[#73B866]" size={48} />,
    foundedYear: "2023", location: "Alger, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  },
  {
    id: 6,
    slug: "bluemed",
    name: "BlueMed",
    shortDescription: "Solutions innovantes pour la santé marine et la blue economy.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "Blue Economy",
    stage: "Ideation",
    logoIcon: <Waves className="text-[#235BA8]" size={48} />,
    foundedYear: "2024", location: "Alger, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  },
  {
    id: 7,
    slug: "shehealth",
    name: "SheHealth",
    shortDescription: "Accompagne les femmes entrepreneures dans la santé et le bien-être.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "Women Entrepreneurship",
    stage: "Seed",
    logoIcon: <UserCircle2 className="text-[#964594]" size={48} />,
    foundedYear: "2024", location: "Alger, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  },
  {
    id: 8,
    slug: "greencare",
    name: "GreenCare",
    shortDescription: "Technologies vertes pour des soins de santé plus durables et responsables.",
    longDescription: ["Lorem ipsum dolor sit amet."],
    sector: "Green Health",
    stage: "Growth",
    logoIcon: <Sprout className="text-[#73B866]" size={48} />,
    foundedYear: "2022", location: "Alger, Algérie", website: "#", linkedin: "#", team: [], needs: [], news: [], videoThumbnail: "", awards: [], funding: { raisedAmount: "", round: "", year: "", investors: "", nextRound: { type: "", goal: "", date: "" }, progressPercent: 0 }, contact: { email: "", phone: "", location: "" }
  }
];
