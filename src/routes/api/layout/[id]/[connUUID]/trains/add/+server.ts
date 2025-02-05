import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const GET = async ({ params }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.layouts.get(id);
    if (!layout) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });

    let connection = layout.connections.get(connUUID);
    if (!connection) return new Response(JSON.stringify({ message: `${connUUID} is not a valid connection on layout: ${id}` }), { status: 406 });


    return new Response(JSON.stringify({ message: `Adding trains is not yet implemented` }), { status: 200 })
}