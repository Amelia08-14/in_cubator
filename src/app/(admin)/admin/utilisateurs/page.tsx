import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./AdminUsersClient";


export default async function AdminUsersPage() {
  const rawUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      startupProfile: true,
      mentorProfile: true,
      investorProfile: true,
      partnerProfile: true,
    }
  });

  // Calculate stats
  const total = rawUsers.length;
  const actifs = rawUsers.filter(u => u.actif).length;
  const desactives = rawUsers.filter(u => !u.actif).length;
  const enAttente = 0; // We can adjust this based on specific logic if needed

  const statsData = { total, actifs, enAttente, desactives };

  // Format data for the table
  const mappedUsers = rawUsers.map(u => {
    let name = "Utilisateur Inconnu";
    if (u.role === "PORTEUR_STARTUP") name = u.startupProfile?.nom || name;
    if (u.role === "MENTOR_EXPERT") name = u.mentorProfile?.nomComplet || name;
    if (u.role === "INVESTISSEUR") name = u.investorProfile?.organisation || name;
    if (u.role === "PARTENAIRE") name = u.partnerProfile?.organisation || name;
    if (u.role === "ADMIN" || u.role === "GESTIONNAIRE") name = "Admin/Manager";

    let roleStr = u.role.replace("_", " ");
    let roleColor = "bg-gray-100 text-gray-700";
    if (u.role === "ADMIN") roleColor = "bg-red-50 text-red-700";
    if (u.role === "PORTEUR_STARTUP") roleColor = "bg-blue-50 text-blue-700";
    if (u.role === "MENTOR_EXPERT") roleColor = "bg-purple-50 text-purple-700";
    if (u.role === "INVESTISSEUR") roleColor = "bg-green-50 text-green-700";

    const dateStr = u.createdAt.toLocaleDateString("fr-FR");
    const timeStr = u.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    return {
      id: u.id,
      name,
      email: u.email,
      avatar: name.charAt(0).toUpperCase(),
      role: roleStr,
      roleColor,
      date: dateStr,
      time: timeStr,
      status: u.actif ? "Actif" : "Désactivé",
      statusColor: u.actif ? "text-green-600" : "text-red-500",
      statusDot: u.actif ? "bg-green-500" : "bg-red-500",
    };
  });

  return (
    <AdminUsersClient usersData={mappedUsers} statsData={statsData} />
  );
}
