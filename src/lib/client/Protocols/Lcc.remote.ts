import { command, query } from "$app/server";
import { App } from "#lib/server/App.server.js";
import { error } from "@sveltejs/kit";
import { z } from "zod/v4";
import { Lcc } from "#lib/server/Connections/Protocol/Lcc/Lcc.js";


export const getLccNodes = query(z.uuid(), async (connectionId) => {
  const connection = await App.getConnection(connectionId);
  if (!connection) error(500, "Connection not found");

  if (!(connection.protocol instanceof Lcc))
    error(500, "LCC connection is not an instance of Lcc");

  return connection.protocol.getNodesSnapshot();
});

export const getLccLog = query(z.uuid(), async (connectionId) => {
  const connection = await App.getConnection(connectionId);
  if (!connection) error(500, "Connection not found");

  if (!(connection.protocol instanceof Lcc))
    error(500, "LCC connection is not an instance of Lcc");

  return connection.protocol.logBuffer;
});


// -----------------------------
// TYPE-SAFE LCC COMMANDS
// -----------------------------
const LccCommandSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("requestInfo")
  }),
  z.object({
    action: z.literal("requestSnipAll")
  }),
  z.object({
    action: z.literal("requestSnip"),
    nodeId: z.string().regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/)
  }),
  z.object({ action: z.literal("discoverNodes") }),
  z.object({
    action: z.literal("requestCdi"),
    nodeId: z.string(),
  }),
]);

// -----------------------------
// REMOTE COMMAND HANDLER
// -----------------------------
export const sendLccCommand = command(
  z.object({
    id: z.uuid(),
    command: LccCommandSchema
  }),
  async ({ id, command }) => {
    const connection = await App.getConnection(id);
    if (!connection) error(500, "Connection not found");

    if (!(connection.protocol instanceof Lcc))
      error(500, "LCC connection is not an instance of Lcc");

    const lcc = connection.protocol;

    // Helper to SLIP-encode and send
    const sendFrame = (frame: Buffer) => {
      const slip = encodeSlipFrame(frame);
      connection.write(slip); // <-- EXACTLY what your serial layer expects
    };

    switch (command.action) {
      case "requestInfo": {
        const frame = lcc["buildFrame"](0x0490, lcc["MY_NODE_ID"], undefined, Buffer.alloc(0));
        sendFrame(frame);
        break;
      }

      case "requestSnipAll": {
        for (const node of lcc.nodes.values()) {
          const dest = Buffer.from(node.id.replace(/:/g, ""), "hex");
          const frame = lcc["buildFrame"](0x0de8, lcc["MY_NODE_ID"], dest, Buffer.alloc(0));
          sendFrame(frame);
        }
        break;
      }

      case "requestSnip": {
        const dest = Buffer.from(command.nodeId.replace(/:/g, ""), "hex");
        const frame = lcc["buildFrame"](0x0de8, lcc["MY_NODE_ID"], dest, Buffer.alloc(0));
        sendFrame(frame);
        break;
      }

      case "discoverNodes": {
        const frame = lcc["buildFrame"](0x0170, lcc["MY_NODE_ID"], undefined, Buffer.alloc(0));
        sendFrame(frame);
        // const slip = encodeSlipFrame(frame);
        // connection.write(slip);
        break;
      }

      case "requestCdi":
        lcc.requestCdi(command.nodeId);
        break;

      default:
        error(500, "Unknown LCC command");
    }

    return { ok: true };
  }
);

// -----------------------------
// SLIP ENCODER
// -----------------------------
function encodeSlipFrame(frame: Buffer): Buffer {
  const out: number[] = [];

  out.push(0xc0); // SLIP start

  for (const b of frame) {
    if (b === 0xc0) out.push(0xdb, 0xdc);
    else if (b === 0xdb) out.push(0xdb, 0xdd);
    else out.push(b);
  }

  out.push(0xc0); // SLIP end

  return Buffer.from(out);
}
