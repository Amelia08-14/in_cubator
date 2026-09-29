import "server-only";

import path from "path";

/**
 * Dossier des images publiques envoyées depuis le back-office (couvertures
 * d'évènements). Hors de public/ pour survivre aux déploiements et être servi
 * à chaud par /api/media, sans redémarrage de Next.
 */
export function getPublicMediaDirectory() {
  const configuredPath = process.env.PUBLIC_MEDIA_DIR;
  return configuredPath ? path.resolve(configuredPath) : path.join(process.cwd(), "storage", "public");
}

export const EVENT_MEDIA_PREFIX = "/api/media/events/";
