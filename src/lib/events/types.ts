// Types et libellés des évènements (miroir de backend/src/modules/events).

export type EventType = "CONFERENCE" | "ATELIER" | "NETWORKING" | "MASTERCLASS" | "DEMO_DAY";
export type EventOrigin = "IN_EVENT" | "EXTERNAL" | "CO_ORGANIZED";
export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EventPhase = "UPCOMING" | "ONGOING" | "PAST";
export type RegistrationStatus = "REGISTERED" | "ATTENDED" | "CANCELLED";

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string;
  type: EventType;
  origin: EventOrigin;
  status: EventStatus;
  location: string | null;
  startAt: string;
  endAt: string;
  capacity: number;
  coverImage: string | null;
  videoUrl: string | null;
  coOrganizerName: string | null;
  registrationsOpen: boolean;
  createdAt: string;
  registeredCount: number;
  spotsLeft: number;
  isFull: boolean;
  isPast: boolean;
  /** Déduite des dates : à venir, en cours (entre début et fin) ou passé. */
  phase: EventPhase;
  canRegister: boolean;
};

export type EventRegistrationRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  organization: string | null;
  message: string | null;
  status: RegistrationStatus;
  createdAt: string;
};

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  CONFERENCE: "Conférence",
  ATELIER: "Atelier",
  NETWORKING: "Networking",
  MASTERCLASS: "Masterclass",
  DEMO_DAY: "Demo Day",
};

export const EVENT_ORIGIN_LABEL: Record<EventOrigin, string> = {
  IN_EVENT: "Organisé par IN-CUBATOR",
  CO_ORGANIZED: "Co-organisé",
  EXTERNAL: "Évènement partenaire",
};

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

export const EVENT_STATUS_STYLE: Record<EventStatus, string> = {
  DRAFT: "bg-paper-deep text-gray-main",
  PUBLISHED: "bg-green-light/60 text-[#245a27]",
  ARCHIVED: "bg-violet-soft text-violet-dark",
};

export const EVENT_PHASE_LABEL: Record<EventPhase, string> = {
  UPCOMING: "À venir",
  ONGOING: "En cours",
  PAST: "Évènement passé",
};

export const REGISTRATION_STATUS_LABEL: Record<RegistrationStatus, string> = {
  REGISTERED: "Inscrit",
  ATTENDED: "Présent",
  CANCELLED: "Annulé",
};

// Les dates s'affichent toujours à l'heure d'Alger, quel que soit le fuseau du navigateur ou du serveur.
const TZ = "Africa/Algiers";

export const formatEventDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(
    new Date(iso),
  );

export const formatEventDay = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", timeZone: TZ }).format(new Date(iso));

export const formatEventMonth = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: TZ }).format(new Date(iso)).replace(".", "");

export const formatEventTime = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso));

export const formatEventRange = (startAt: string, endAt: string) =>
  `${formatEventTime(startAt)} – ${formatEventTime(endAt)}`;

/** Valeur d'un champ datetime-local (heure d'Alger, UTC+1 sans changement d'heure). */
export function toDatetimeLocal(iso?: string): string {
  if (!iso) return "";
  const shifted = new Date(new Date(iso).getTime() + 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

/** Inverse de toDatetimeLocal : une saisie « heure d'Alger » devient un instant UTC. */
export function fromDatetimeLocal(value: string): string {
  return new Date(`${value}:00+01:00`).toISOString();
}
