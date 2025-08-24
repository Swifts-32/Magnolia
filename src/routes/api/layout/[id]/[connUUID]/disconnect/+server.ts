import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const GET = async ({ params }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter

    const connection = LayoutServerHandler.layouts.get(id as LayoutUUID)?.connections.get(connUUID as ConnectionUUID);
    if (!connection) return new Response(JSON.stringify({ message: `Connection is undefined` }), { status: 406 });

    const result = await connection.disconnect();
    return new Response(JSON.stringify({ message: result }), { status: 200 })
}