import { command, form, query } from "$app/server";
import { ConnectionProtocol, ConnectionType } from "$lib/client/Protocols/protocols";
import { db } from "$lib/server/db";
import { ConnectionProtocolEnum, ConnectionTable, ConnectionTypeEnum, type Connection } from "$lib/server/db/schema/connection";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { string, uuid, z } from "zod/v4";

async function getConnectionFromDb(connectionId: string) {
  const connections: Connection[] = await db.select().from(ConnectionTable).where(eq(ConnectionTable.uuid, connectionId));

  if (connections.length < 1 || connections.length > 1) error(404, "Not found");

  return connections[0];
}

// Get a connection using the connection Id
export const getConnection = query(z.uuid().nullable(), async (connectionId) => {
  if (connectionId === null) error(404, "No Connection provided");
  return await getConnectionFromDb(connectionId);
});

// Get connections for a specific layoutl
export const getConnections = query(z.uuid(), async (layoutId) => {
  const connections: Connection[] = await db.select().from(ConnectionTable).where(eq(ConnectionTable.layoutUuid, layoutId));

  return connections;
});


export const deleteConnection = command(z.uuid(), async (connectionId) => {
  const connection = await getConnectionFromDb(connectionId);

  const res = await db.delete(ConnectionTable)
    .where(eq(ConnectionTable.uuid, connectionId))
    .returning();

  if (res.length === 0) error(404, "Connection not found");

  await getConnections(connection.layoutUuid).refresh();
});


const BaseHardware = z.object({
  type: z.string(),
});

const SerialSchema = BaseHardware.extend({
  type: z.literal("Serial"),
  baudRate: z.number(),
  path: z.string().trim().min(1),
});
const WifiSchema = BaseHardware.extend({
  type: z.literal("Wifi"),
  address: z.number(),
});
const EmulatorSchema = BaseHardware.extend({
  type: z.literal("Emulator"),
});

const HardwareSchema = z.discriminatedUnion("type", [
  SerialSchema,
  WifiSchema,
  EmulatorSchema
]);

export const editConnection = form(
  z.object({
    uuid: z.uuid(),
    name: z.string().trim().max(255).min(1),
    layoutId: uuid(),
    protocol: ConnectionProtocol,
    hardware: HardwareSchema,
  }),
  async ({ uuid, name, layoutId, protocol, hardware }) => {
    // await db.update(ConnectionTable).set({
    //   name: name,
    //   protocol: protocol,
    //   hardware: hardware,
    // }).where(eq(ConnectionTable.uuid, uuid));

    await getConnections(layoutId).refresh();
  });

export const createConnection = form(
  z.object({
    name: z.string().trim().max(255).min(1),
    layoutId: z.string(),
    protocol: ConnectionProtocol,
    hardware: ConnectionType,
  }),
  async ({ name, layoutId, hardware, protocol }) => {

    try {

      await db.insert(ConnectionTable).values({
        uuid: crypto.randomUUID(),
        layoutUuid: layoutId,
        name,
        protocol,
        hardware,
      });
    }
    catch (e) {
      error(500, "Failed to insert");
    }

    await getConnections(layoutId).refresh();
  });
