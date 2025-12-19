import { command, form, query } from "$app/server";
import { ConnectionProtocol, ConnectionType } from "$lib/client/Protocols/protocols";
import { App } from "$lib/server/App.server.svelte";
import { getConnectionsFromDb } from "$lib/server/Connections/Connection.server";
import { db } from "$lib/server/db";
import { ConnectionTable } from "$lib/server/db/schema/connection";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { uuid, z } from "zod/v4";

// Get a connection using the connection Id
export const getConnection = query(z.uuid().nullable(), async (connectionId) => {
  if (connectionId === null) error(404, "No Connection provided");
  const connnections = await getConnectionsFromDb(connectionId);

  return connnections[0]
});

// Get connections for a specific layoutl
export const getConnections = query(z.uuid(), async (layoutId) => {
  const connections = await db.select().from(ConnectionTable).where(eq(ConnectionTable.layoutUuid, layoutId));
  const normalized = connections.map(c => ({ ...c, hardware: c.hardware ?? undefined, }));
  return normalized;
});


export const deleteConnection = command(z.uuid(), async (connectionId) => {
  const connections = await getConnectionsFromDb(connectionId);

  const res = await db.delete(ConnectionTable)
    .where(eq(ConnectionTable.uuid, connectionId))
    .returning();

  if (res.length === 0) error(404, "Connection not found");

  await getConnections(connections[0].layoutUuid).refresh();
});


const HardwareSchema = z.object({
  type: ConnectionType,
  baudRate: z.number().optional(),
  path: z.string().optional(),
  address: z.number().optional()
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
    await db.update(ConnectionTable).set({
      name: name,
      protocol: protocol,
      hardware: hardware,
    }).where(eq(ConnectionTable.uuid, uuid));

    await getConnections(layoutId).refresh();
  });

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
    }
    catch (e) {
      error(500, "Failed to insert");
    }

    await getConnections(layoutId).refresh();
  });

export const connectConnection = command(z.uuid(), async (connectionId) => {
  const appConnection = await App.getConnection(connectionId);
  if (!appConnection) {
    error(500, "Connection not found");
  }

  const result = await appConnection.connect();
  console.log(`Connected Connection: ${result}`);
});

export const unloadConnection = command(z.uuid(), async (connectionId) => {
  const result = await App.unloadConnection(connectionId);
  console.log(`Unloaded Connection: ${result}`);
});
