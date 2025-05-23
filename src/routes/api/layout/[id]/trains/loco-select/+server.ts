import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { TrainTable } from "$lib/server/db/schema/trains";
import { ConnectionTable } from "$lib/server/db/schema/connection";

export const GET = async ({ params }) => {
  const { id } = params;

  const trains = await db.select({
    id: TrainTable.uuid,
    address: TrainTable.address,
    name: TrainTable.name,
    connName: ConnectionTable.name,
  }).from(TrainTable)
    .where(eq(TrainTable.layoutUuid, id)) // Only return trains that are in this layout
    .leftJoin(ConnectionTable, eq(TrainTable.connectionUuid, ConnectionTable.uuid));

  return new Response(JSON.stringify({ trains: trains }), { status: 200 });
}