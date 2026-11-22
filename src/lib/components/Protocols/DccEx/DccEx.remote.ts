import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { z } from "zod/v4";

import { App } from "#lib/server/App.server.js";
import { DccEx } from "../../../server/Connections/Protocol/DccEx/DccEx";

export const getTracksStatus = query.live(
  z.uuid(),
  async function* (connectionId) {
    const connection = await App.getConnection(connectionId);

    if (!connection) {
      error(500, "Connection not found");
    }

    if (!(connection.protocol instanceof DccEx)) {
      error(500, "DccEx connection is not an instance of DccEx");
    }

    const dccEx = connection.protocol;

    // Request the current track state from the command station.
    connection.write(Buffer.from("<=>", "utf8"));

    // Send the current state immediately.
    yield [...dccEx.trackStatus];

    let version = 0;
    let wake: (() => void) | null = null;

    const notify = () => {
      version++;

      if (wake) {
        const resolve = wake;
        wake = null;

        queueMicrotask(resolve);
      }
    };

    const unsubscribe = dccEx.onUpdate(notify);

    let lastProcessedVersion = version;

    try {
      while (true) {
        while (version === lastProcessedVersion) {
          await new Promise<void>((resolve) => {
            wake = resolve;
          });
        }

        lastProcessedVersion = version;

        yield [...dccEx.trackStatus];
      }
    } finally {
      unsubscribe();
    }
  },
);
