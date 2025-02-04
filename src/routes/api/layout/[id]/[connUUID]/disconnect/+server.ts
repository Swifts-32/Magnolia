import { LayoutServerHandler } from "../../../../../../lib/server/layoutHandler.server.svelte";

export const GET = async ({ params }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.Layouts.get(id);

    if (layout) {
        let connection = layout.connections.get(connUUID);

        if (!connection) return new Response(JSON.stringify({ message: `DCC connection does not exist on layout: ${id}` }), { status: 406 });

        connection.disconnect();

        return new Response(JSON.stringify({ message: `Disconnected DCC from layout ${id}` }), { status: 200 })
    }
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
}