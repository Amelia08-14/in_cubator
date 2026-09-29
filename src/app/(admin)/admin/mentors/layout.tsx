import type { ReactNode } from "react";

import { requireAdminSection } from "@/lib/page-auth";

// Toute la section est réservée aux comptes qui y ont accès.
export default async function Layout({ children }: { children: ReactNode }) {
  await requireAdminSection("mentors");
  return children;
}
