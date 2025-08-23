import { command, form, query } from "$app/server";
import { ConnectionProtocol, ConnectionType } from "$lib/client/Protocols/protocols";
import { db } from "$lib/server/db";
import { ConnectionProtocolEnum, ConnectionTable, ConnectionTypeEnum, type Connection } from "$lib/server/db/schema/connection";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { string, uuid, z } from "zod/v4";

// Get a connection using the connection Id
export const getConnection = query(z.uuid().nullable(), async (connectionId) => {
  if (connectionId === null) error(404, "No Connection provided");

  const connections: Connection[] = await db.select().from(ConnectionTable).where(eq(ConnectionTable.uuid, connectionId));

  if (connections.length < 1 || connections.length > 1) error(404, "Not found");

  return connections[0];
});

// Get connections for a specific layout
export const getConnections = query(z.uuid(), async (layoutId) => {
  const connections: Connection[] = await db.select().from(ConnectionTable).where(eq(ConnectionTable.layoutUuid, layoutId));

  return connections;
});


export const deleteConnection = command(z.uuid(), async (connectionId) => {
  const res = await db.delete(ConnectionTable)
    .where(eq(ConnectionTable.uuid, connectionId))
    .returning();

  if (res.length === 0) error(404, "Connection not found");
});

export const editConnection = form(async (data: FormData) => {
  const connectionSchema = z.object({
    uuid: z.uuid(),
    name: z.string().trim().max(255).min(1),
    layoutUuid: uuid(),
    protocol: ConnectionProtocol,
    hardware: ConnectionType,
  });

  const connectionData = connectionSchema.safeParse(Object.fromEntries(data));

  if (!connectionData.success) {
    return error(400, z.prettifyError(connectionData.error));
  }

  await db.update(ConnectionTable).set({
    name: connectionData.data.name,
    protocol: connectionData.data.protocol,
    hardware: connectionData.data.hardware,
  }).where(eq(ConnectionTable.uuid, connectionData.data.uuid));

  await getConnections(connectionData.data.layoutUuid).refresh();
});

export const createConnection = form(async (data: FormData) => {
  const connectionSchema = z.object({
    name: z.string().trim().max(255).min(1),
    layoutUuid: uuid(),
    protocol: ConnectionProtocol,
    hardware: ConnectionType,
  });

  const connectionData = connectionSchema.safeParse(Object.fromEntries(data));

  if (!connectionData.success) {
    return error(400, z.prettifyError(connectionData.error));
  }

  await db.insert(ConnectionTable).values({
    uuid: crypto.randomUUID(),
    layoutUuid: connectionData.data.layoutUuid,
    name: connectionData.data.name,
    protocol: connectionData.data.protocol,
    hardware: connectionData.data.hardware,
  });

  await getConnections(connectionData.data.layoutUuid).refresh();
});
