"use client";

import { apiClientV2 } from "@/lib/api-client-v2";
import type {
  EventItem,
  EventOrigin,
  EventRegistrationRow,
  EventStatus,
  EventType,
  RegistrationStatus,
} from "./types";

export type EventInput = {
  title: string;
  summary: string | null;
  description: string;
  type: EventType;
  origin: EventOrigin;
  location: string | null;
  startAt: string;
  endAt: string;
  capacity: number;
  coverImage: string | null;
  videoUrl: string | null;
  coOrganizerName: string | null;
  registrationsOpen: boolean;
  status: EventStatus;
};

export type RegistrationInput = {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  message?: string;
  website?: string;
};

export const eventsApi = {
  async create(input: EventInput) {
    return (await apiClientV2<{ event: EventItem }>("/admin/events", { method: "POST", body: JSON.stringify(input) })).event;
  },
  async patch(id: string, patch: Partial<EventInput>) {
    return (await apiClientV2<{ event: EventItem }>(`/admin/events/${id}`, { method: "PATCH", body: JSON.stringify(patch) })).event;
  },
  async remove(id: string) {
    await apiClientV2<void>(`/admin/events/${id}`, { method: "DELETE" });
  },
  async registrations(id: string) {
    return (await apiClientV2<{ registrations: EventRegistrationRow[] }>(`/admin/events/${id}/registrations`)).registrations;
  },
  async setRegistrationStatus(id: string, registrationId: string, status: RegistrationStatus) {
    await apiClientV2(`/admin/events/${id}/registrations/${registrationId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  /** Inscription publique, sans compte. */
  async register(slug: string, input: RegistrationInput) {
    return apiClientV2<{ registered: boolean; spotsLeft?: number }>(`/events/${encodeURIComponent(slug)}/registrations`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
