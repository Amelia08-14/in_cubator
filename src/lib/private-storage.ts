import "server-only";

import path from "path";

export function getPrivateStorageDirectory() {
  const configuredPath = process.env.PRIVATE_STORAGE_DIR;
  return configuredPath
    ? path.resolve(configuredPath)
    : path.join(process.cwd(), "storage", "private");
}
