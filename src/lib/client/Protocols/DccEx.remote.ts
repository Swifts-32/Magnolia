import { query } from "$app/server";
import { App } from "$lib/server/App.server";
import { error } from "@sveltejs/kit";
import { z } from "zod/v4";
import { DccEx } from "../../server/Connections/Protocol/DccEx/DccEx";
import { protocolEvents } from "$lib/server/events";

protocolEvents.on('dccEx_tracks', (connectionId: string) => {
  getTracksStatus(connectionId).refresh();
});

export const getTracksStatus = query(z.uuid(), async (connectionId) => {
  console.log("UPdate")
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
  // let sequenceNumber = 0;

  // while (true) {
  //   const nextEvent = await connection.hardwareQueue.next();

  //   sequenceNumber++;
  
  //   yield {
  //       id: sequenceNumber, 
  //       text: nextEvent // Your raw DCC-EX text string
  //   };
  // }
//   return connection.protocol.trackStatus;
// });

