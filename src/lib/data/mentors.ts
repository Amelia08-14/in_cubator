export interface Mentor {
  id: string;
  name: string;
  role: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  image: string;
}

export const mentorsData: Mentor[] = [
  {
    id: "1",
    name: "Yacine Khelifi",
    role: "Financial Modeling",
    tags: ["Health Tech", "Biotechnologies"],
    rating: 4.8,
    reviewCount: 26,
    image: "/placeholder-avatar.png",
  },
  {
    id: "2",
    name: "Inès Bensalem",
    role: "Medical Regulatory Affairs",
    tags: ["MedTech", "Pharma"],
    rating: 4.7,
    reviewCount: 18,
    image: "/placeholder-avatar.png",
  },
  {
    id: "3",
    name: "Karim Benyahia",
    role: "Growth Strategy",
    tags: ["Health Tech", "Digital Health"],
    rating: 4.9,
    reviewCount: 31,
    image: "/placeholder-avatar.png",
  },
  {
    id: "4",
    name: "Sarah Mellal",
    role: "Fundraising & VC",
    tags: ["Biotechnologies", "Health Tech"],
    rating: 4.6,
    reviewCount: 22,
    image: "/placeholder-avatar.png",
  },
  {
    id: "5",
    name: "Hamid Zerguine",
    role: "Operations Excellence",
    tags: ["Smart Hospital", "Health Tech"],
    rating: 4.5,
    reviewCount: 14,
    image: "/placeholder-avatar.png",
  },
  {
    id: "6",
    name: "Lamia Bouzid",
    role: "Marketing & Branding",
    tags: ["Health Tech", "Women Entrepreneurship"],
    rating: 4.7,
    reviewCount: 19,
    image: "/placeholder-avatar.png",
  },
  {
    id: "7",
    name: "Mehdi Boukenza",
    role: "Data & AI Strategy",
    tags: ["Health Tech", "Digital Health"],
    rating: 4.8,
    reviewCount: 27,
    image: "/placeholder-avatar.png",
  },
  {
    id: "8",
    name: "Nouria Ait",
    role: "Product & Innovation",
    tags: ["MedTech", "Biotechnologies"],
    rating: 4.6,
    reviewCount: 15,
    image: "/placeholder-avatar.png",
  },
];
