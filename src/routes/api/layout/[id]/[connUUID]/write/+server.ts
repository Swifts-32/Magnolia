import { LayoutServerHandler } from "../../../../../../lib/server/LayoutHandler.server.svelte";

export const GET = async ({ params, url }) => {
    let { id, connUUID } = params; // Extract the dynamic parameter
    let data = url.searchParams.get("data")

    const layout = LayoutServerHandler.layouts.get(id);

    if (layout) {
        let connection = layout.connections.get(connUUID);

        if (!connection)
            return new Response(JSON.stringify({ message: `DCC connection does not exist on layout: ${id}` }), { status: 406 });

        else if (!connection.hardware.isConnected)
            return new Response(JSON.stringify({ message: `DCC is not connected on layout ${id}` }), { status: 406 });

        else if (!data)
            return new Response(JSON.stringify({ message: `No data to write to ${id}` }), { status: 401 });

        connection.write(data);
        return new Response(JSON.stringify({ message: "Sent: ", data }), { status: 200 });

    }

    return new Response(JSON.stringify({ message: `Layout doesn't exist on ${id}` }), { status: 404 });
}