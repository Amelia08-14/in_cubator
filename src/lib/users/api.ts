"use client";

import { apiClientV2 } from "@/lib/api-client-v2";
import type { StaffRole, UserRow } from "./types";

export type CreateUserInput = {
  fullName: string;
  email: string;
  role: StaffRole;
  sections: string[];
  /** Absent : un mot de passe temporaire est généré par l'API. */
  password?: string;
};

export type PatchUserInput = Partial<{ fullName: string; role: StaffRole; sections: string[]; actif: boolean }>;

export const usersApi = {
  async create(input: CreateUserInput) {
    return apiClientV2<{ user: UserRow; temporaryPassword: string | null }>("/admin/users", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async patch(id: string, patch: PatchUserInput) {
    return (await apiClientV2<{ user: UserRow }>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(patch) })).user;
  },
  async resetPassword(id: string) {
    return (await apiClientV2<{ temporaryPassword: string }>(`/admin/users/${id}/reset-password`, { method: "POST" })).temporaryPassword;
  },
};
