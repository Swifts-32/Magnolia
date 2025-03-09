import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const GET = async ({ params, url }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter
    let data = url.searchParams.get("data")

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `Layout doesn't exist on ${id}` }), { status: 404 });
    }

    const connection = layout.connections.get(connUUID as ConnectionUUID);
    if (!connection) {
        return new Response(JSON.stringify({ message: `Connection does not exist on layout: ${id}` }), { status: 406 });
    }

    else if (!connection.isConnected) {
        return new Response(JSON.stringify({ message: `Connection ${connection.name} is not connected on layout ${id}` }), { status: 406 });
    }

    else if (!data) {

        return new Response(JSON.stringify({ message: `No data to write to ${id} on connection ${connection.name}` }), { status: 401 });
    }

    connection.write(data);
    return new Response(JSON.stringify({ message: `Sent: ${data} to ${id} on connection ${connection.name}` }), { status: 200 });

}