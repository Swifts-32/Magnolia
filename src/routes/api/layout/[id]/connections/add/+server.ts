import { Connection } from "$lib/server/Connections/connection.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const POST = async ({ request }) => {
  const data = await request.json();

  const connection = Connection.fromJsonWeb(data);
  if (!connection) {
    return new Response(JSON.stringify({ message: `Invalid connection data` }), { status: 400 });
  }

  const layout = LayoutServerHandler.layouts.get(connection.layoutUuid);
  if (!layout) {
    return new Response(JSON.stringify({ message: `${connection.layoutUuid} is not a valid layout.` }), { status: 404 });
  }

  layout.createConnection(connection);

  return new Response(
    JSON.stringify({
      message: `Connection created successfully on layout: ${layout.name}`,
      connUUID: connection.uuid
    }),

    { status: 201 }
  );
}