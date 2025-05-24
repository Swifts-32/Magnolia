import { db } from '$lib/server/db';
import { ConnectionTable } from '$lib/server/db/schema/connection';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
  const { id } = params;

  const connections = db.select({
    id: ConnectionTable.uuid,
    name: ConnectionTable.name,
  }).from(ConnectionTable)
  // .where(eq(ConnectionTable.layoutUuid, id));

  return new Response(JSON.stringify({ connections }), { status: 200 });

}