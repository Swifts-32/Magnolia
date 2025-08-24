import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { ConnectionTable } from "$lib/server/db/schema/connection";
import { getProtocolName } from "$lib/client/Protocols/protocols.js";

export const GET = async ({ params }) => {
  const { id } = params;

  const connections = await db.select({
    id: ConnectionTable.uuid,
    name: ConnectionTable.name,
    protocol: ConnectionTable.protocol,
    hardware: ConnectionTable.hardware,
  }).from(ConnectionTable)
    .where(eq(ConnectionTable.layoutUuid, id)); // Only return connections that are in this layout

  return new Response(JSON.stringify({ connections: connections }), { status: 200 });
}