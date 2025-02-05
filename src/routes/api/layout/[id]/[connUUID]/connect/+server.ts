import { LayoutServerHandler } from "../../../../../../lib/server/LayoutHandler.server.svelte";

export const GET = async ({ params }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.layouts.get(id);

    if (layout) {
        let connection = layout.connections.get(connUUID);
        if (!connection) return new Response(JSON.stringify({ message: `Connection does not exist on layout: ${id}` }), { status: 406 });

        try {
            connection.connect();
            return new Response(JSON.stringify({ message: `Succesfully connected to: ${connection.name}` }), { status: 200 });        }
        catch (err) {
            return new Response(JSON.stringify({ message: `Failed to connect to ${connection.name} - ${err}` }), { status: 400 });
        }
    }
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
}