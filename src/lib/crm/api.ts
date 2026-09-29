"use client";

import { apiClientV2 } from "@/lib/api-client-v2";
import type {
  ActivityType,
  Lead,
  LeadActivity,
  LeadDetailData,
  LeadSource,
  LeadStage,
  LeadType,
} from "./types";

export type LeadInput = {
  title: string;
  contactName: string;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  type: LeadType;
  source: LeadSource;
  stage: LeadStage;
  priority: number;
  score?: number | null;
  message?: string | null;
  assignedToId?: string | null;
};

export type LeadPatch = Partial<Omit<LeadInput, "stage">> & { stage?: LeadStage };

const json = (body: unknown) => JSON.stringify(body);

export const crmApi = {
  async create(input: LeadInput) {
    return (await apiClientV2<{ lead: Lead }>("/crm/leads", { method: "POST", body: json(input) })).lead;
  },
  async patch(id: string, patch: LeadPatch) {
    return (await apiClientV2<{ lead: Lead }>(`/crm/leads/${id}`, { method: "PATCH", body: json(patch) })).lead;
  },
  async detail(id: string) {
    return (await apiClientV2<{ lead: LeadDetailData }>(`/crm/leads/${id}`)).lead;
  },
  async win(id: string) {
    return (await apiClientV2<{ lead: Lead }>(`/crm/leads/${id}/win`, { method: "POST" })).lead;
  },
  async lose(id: string, reason: string) {
    return (await apiClientV2<{ lead: Lead }>(`/crm/leads/${id}/lose`, { method: "POST", body: json({ reason }) })).lead;
  },
  async reopen(id: string) {
    return (await apiClientV2<{ lead: Lead }>(`/crm/leads/${id}/reopen`, { method: "POST" })).lead;
  },
  async remove(id: string) {
    await apiClientV2<void>(`/crm/leads/${id}`, { method: "DELETE" });
  },
  async addActivity(id: string, input: { type: Exclude<ActivityType, "SYSTEME">; content: string; dueAt?: string | null }) {
    return (
      await apiClientV2<{ activity: LeadActivity }>(`/crm/leads/${id}/activities`, {
        method: "POST",
        body: json(input),
      })
    ).activity;
  },
  async completeActivity(activityId: string) {
    return (
      await apiClientV2<{ activity: LeadActivity }>(`/crm/activities/${activityId}/complete`, { method: "POST" })
    ).activity;
  },
  async deleteActivity(activityId: string) {
    await apiClientV2<void>(`/crm/activities/${activityId}`, { method: "DELETE" });
  },
};
