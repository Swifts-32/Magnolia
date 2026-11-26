import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { z } from "zod/v4";
import { App } from "#lib/server/App.server.js";
import { DccEx } from "./server/DccEx";
import type { BaseProtocol } from "../BaseProtocol";

/**
 * Converts a protocol instance and a data selector into a standardized live async generator,
 * with optional background polling.
 */
async function* streamProtocolData<T>(
  protocol: BaseProtocol,
  selector: () => T,
  options?: {
    pollIntervalMs?: number;
    onPoll?: () => void;
  },
): AsyncGenerator<T, void, unknown> {
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

  const unsubscribe = protocol.onUpdate(notify);

  // Set up background polling interval if provided
  let timer: NodeJS.Timeout | undefined;
  if (options?.pollIntervalMs && options?.onPoll) {
    timer = setInterval(() => {
      options.onPoll!();
    }, options.pollIntervalMs);
  }

  let lastProcessedVersion = version;

  try {
    while (true) {
      while (version === lastProcessedVersion) {
        await new Promise<void>((resolve) => {
          wake = resolve;
        });
      }

      lastProcessedVersion = version;
      yield selector();
    }
  } finally {
    // Ensure timer and listeners are cleaned up when the client disconnects
    if (timer) clearInterval(timer);
    unsubscribe();
  }
}
export const getDccExInfo = query.live(
  z.uuid(),
  async function* (connectionId) {
    const connection = await App.getConnection(connectionId);
    if (!connection || !connection.protocol) {
      error(500, "Connection not found");
    }

    if (!(connection.protocol instanceof DccEx)) {
      error(500, "Connection is not a DCC-EX protocol");
    }

    const dccEx = connection.protocol;

    // Request fresh hardware info
    connection.write(Buffer.from("<s>"));
    connection.write(Buffer.from("<#>"));

    yield* streamProtocolData(dccEx, () => dccEx.info);
  },
);

export const getTracksStatus = query.live(
  z.uuid(),
  async function* (connectionId) {
    const connection = await App.getConnection(connectionId);
    if (!connection || !connection.protocol) {
      error(500, "Connection not found");
    }

    if (!(connection.protocol instanceof DccEx)) {
      error(500, "DccEx connection is not a DCC-EX protocol");
    }

    const dccEx = connection.protocol;

    // Initial fetch on connection load
    connection.write(Buffer.from("<=>", "utf8"));
    connection.write(Buffer.from("<JI>", "utf8"));
    connection.write(Buffer.from("<JG>", "utf8"));

    // Stream updates with a 2-second background poll
    yield* streamProtocolData(dccEx, () => [...dccEx.trackStatus], {
      pollIntervalMs: 2000,
      onPoll: () => {
        connection.write(Buffer.from("<=>", "utf8"));
        connection.write(Buffer.from("<JI>", "utf8"));
      },
    });
  },
);
