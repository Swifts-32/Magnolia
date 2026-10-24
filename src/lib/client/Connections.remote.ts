import { command, form, query, requested } from "$app/server";
import { ConnectionProtocol } from "#lib/types/Protocols.js";
import { App } from "#lib/server/App.server.js";
import { db } from "#lib/server/db/index.js";
import { ConnectionTable } from "#lib/server/db/schema/connection.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { uuid, z } from "zod/v4";
import { ConnectionType } from "#lib/types/Hardware.js";

// Get a connection using the connection Id
export const getConnection = query(
  z.uuid().nullable(),
  async (connectionId) => {
    if (connectionId === null) error(404, "No Connection provided");

    const connections = await db
      .select()
      .from(ConnectionTable)
      .where(eq(ConnectionTable.uuid, connectionId));

    return connections[0];
  },
);

/* Get connections for a specific layoutl */
export const getlayoutConnections = query(z.uuid(), async (layoutId) => {
  const connections = await db
    .select()
    .from(ConnectionTable)
    .orderBy(ConnectionTable.name)
    .where(eq(ConnectionTable.layoutUuid, layoutId));

  const normalized = connections.map((c) => ({
    ...c,
    hardware: c.hardware ?? undefined,
  }));
  return normalized;
});

export const deleteConnection = command(z.uuid(), async (connectionId) => {
  const connections = await db
    .select()
    .from(ConnectionTable)
    .where(eq(ConnectionTable.uuid, connectionId));

  const res = await db
    .delete(ConnectionTable)
    .where(eq(ConnectionTable.uuid, connectionId))
    .returning();

  if (res.length === 0) error(404, "Connection not found");

  await getlayoutConnections(connections[0].layoutUuid).refresh();
});

const HardwareSchema = z.object({
  type: ConnectionType,
  baudRate: z.number().optional(),
  path: z.string().optional(),
  address: z.number().optional(),
});

export type ConnectionHardwareType = z.infer<typeof HardwareSchema>;

export const editConnection = form(
  z.object({
    uuid: z.uuid(),
    name: z.string().trim().max(255).min(1),
    layoutId: uuid(),
    protocol: ConnectionProtocol,
    hardware: HardwareSchema,
  }),
  async ({ uuid, name, layoutId, protocol, hardware }) => {
    let wasConnected = false;
    try {
      await App.unloadConnection(uuid);
      wasConnected = true;
    } catch {
      console.log("Connection not connected");
    }

    await db
      .update(ConnectionTable)
      .set({
        name: name,
        protocol: protocol,
        hardware: hardware,
      })
      .where(eq(ConnectionTable.uuid, uuid));

    if (wasConnected) {
      await connectConnection(uuid);
    }

    getlayoutConnections(layoutId).refresh();
  },
);

export const createConnection = form(
  z.object({
    name: z.string().trim().max(255).min(1),
    layoutId: z.string(),
    protocol: ConnectionProtocol,
    hardware: HardwareSchema,
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
    } catch (e) {
      error(500, "Failed to insert");
    }

    getlayoutConnections(layoutId).refresh();
  },
);

export const duplicateConnection = command(z.uuid(), async (connId) => {
  const conn = await getConnection(connId);

  const { uuid, ...rest } = conn;

  await db.insert(ConnectionTable).values({
    ...rest,
    name: `${conn.name} (Copy)`,
  });

  getlayoutConnections(conn.layoutUuid).refresh();
});

export const connectConnection = command(z.uuid(), async (connectionId) => {
  const appConnection = await App.getConnection(connectionId);
  if (!appConnection) error(500, "Connection not found");

  const result = await appConnection.connect();
  if (!result.success) error(500, "Connection failed to connect");

  // await getConnection(connectionId).refresh();
  await getlayoutConnections(appConnection.layoutId).refresh();

  await requested(getConnection, 1).refreshAll();
  await requested(getlayoutConnections, 1).refreshAll();
});

export const disconnectConnection = command(z.uuid(), async (connectionId) => {
  const connection = await App.unloadConnection(connectionId);

  // await getConnection(connectionId).refresh();
  await getlayoutConnections(connection.layoutId).refresh();
  await requested(getConnection, 1).refreshAll();
  await requested(getlayoutConnections, 1).refreshAll();
});

export const writeStringToConnection = command(
  z.object({
    id: z.uuid(),
    command: z.string(),
  }),
  async ({ id, command }) => {
    const connection = await App.getConnection(id);
    if (!connection) error(500, "Connection not found");

    const buffer = Buffer.from(command, "utf8");

    connection.write(buffer);
  },
);

export const streamConnectionLogs = query.live(
  z.uuid(),
  async function* (connectionId) {
    const connection = await App.getConnection(connectionId);
    if (!connection) error(500, "Connection not found");

    let sequenceNumber = 0;

    while (true) {
      const nextEvent = await connection.hardwareQueue.next();

      sequenceNumber++;

      yield {
        id: sequenceNumber,
        text: nextEvent, // Your raw DCC-EX text string
      };
    }
  },
);
