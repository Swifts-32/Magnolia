import { readdir, realpath } from "node:fs/promises";
import { join } from "node:path";

export interface SerialPortInfo {
  path: string;
  friendlyName?: string;
  isCustom: boolean;
}

import { query } from "$app/server";

export const getSerialPorts = query(async () => {
  const ports: SerialPortInfo[] = [];

  try {
    const byIdEntries = await readdir("/dev/serial/by-id");

    for (const entry of byIdEntries) {
      const symlinkPath = join("/dev/serial/by-id", entry);

      try {
        const resolved = await realpath(symlinkPath);

        ports.push({
          path: symlinkPath,
          friendlyName: entry,
          isCustom: false,
        });
      } catch {
        // Ignore broken links
      }
    }
  } catch {
    // /dev/serial/by-id may not exist
  }

  return ports;
});
