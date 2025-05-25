import type { ConnectionUUID } from '$lib/client/LayoutClient.svelte.js';
import { Connection } from '$lib/server/Connections/connection.svelte.js';

export const GET = async ({ params }) => {
  const { connUUID } = params;

  const connection = await Connection.getConnectionFromDb(connUUID as ConnectionUUID);

  if (connection) {
    return new Response(JSON.stringify({ message: "Found Connection", connection: connection.toJsonWeb() }), { status: 200 });
  }
  else {
    return new Response(JSON.stringify({ message: "Connection does not exist" }), { status: 404 });
  }
}