import type { Metadata } from "next";

import UsersWorkspace from "@/components/features/admin/utilisateurs/UsersWorkspace";
import { requireAdminSection } from "@/lib/page-auth";
import { adminApi } from "@/lib/server-api";
import type { UserRow, UsersStats } from "@/lib/users/types";

export const metadata: Metadata = { title: "Utilisateurs" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // Réservé aux administrateurs : un manager n'y accède jamais.
  const session = await requireAdminSection("utilisateurs");
  const { users, stats } = await adminApi<{ users: UserRow[]; stats: UsersStats }>("/api/admin/users");

  return <UsersWorkspace users={users} stats={stats} currentUserId={session.user.id} />;
}
