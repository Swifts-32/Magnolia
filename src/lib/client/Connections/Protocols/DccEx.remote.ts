import { query } from "$app/server";
import { App } from "$lib/server/App.server.svelte";
import { error } from "@sveltejs/kit";
import { z } from "zod/v4";
import { DccEx } from "../../../server/Connections/Protocol/DccEx/DccEx";

export const getTracksStatus = query(z.uuid(), async (connectionId) => {
  const connection = await App.getConnection(connectionId);
  if (!connection) error(500, "Connection not found");

  if (!(connection.protocol instanceof DccEx))
    error(500, "DccEx connection is not an instance of DccEx");

  return connection.protocol.trackStatus;
});

// export const getTrainUpdate = query(z.object({
//   id: z.uuid(),
//   command: z.string(),
// }), async (connectionId) => {
//   const connection = await App.getConnection(connectionId);
//   if (!connection) error(500, "Connection not found");

//   if (!(connection.protocol instanceof DccEx))
//     error(500, "DccEx connection is not an instance of DccEx");

//   return connection.protocol.trackStatus;
// });

