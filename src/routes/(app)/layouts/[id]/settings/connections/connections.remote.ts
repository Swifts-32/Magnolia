import { query } from "$app/server";
import { db } from "$lib/server/db";
import { ConnectionTable, type Connection } from "$lib/server/db/schema/connection";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const getConnection = query(z.uuid().nullable(), async (connectionId) => {
  if (connectionId === null) error(404, "No Connection provided");

  const connections: Connection[] = await db.select().from(ConnectionTable).where(eq(ConnectionTable.uuid, connectionId));

  if (connections.length < 1 || connections.length > 1) error(404, "Not found");

  return connections[0];
});
