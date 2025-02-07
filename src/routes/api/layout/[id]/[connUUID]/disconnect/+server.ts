import { LayoutServerHandler } from "../../../../../../lib/server/LayoutHandler.server.svelte";

export const GET = async ({ params }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.layouts.get(id);
    if (!layout) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });

    let connection = layout.connections.get(connUUID);
    if (!connection) return new Response(JSON.stringify({ message: `Connection does not exist on layout: ${id}` }), { status: 406 });

    const result = await connection.disconnect();
    return new Response(JSON.stringify({ message: result }), { status: 200 })
}