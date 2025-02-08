import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { ConnectionProtocols, ConnectionTypes } from "$lib/client/Protocols/protocols";
import type { Connection } from "$lib/server/Connections/connection.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const POST = async ({ request, params }) => {
    const { id } = params;

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    try {
        const data = await request.json();

        // Validate required fields
        if (data.connName === undefined || data.protocol === undefined || data.connType === undefined) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: connName, protocol, and connType are required' }),
                { status: 400 }
            );
        }

        let connection: Connection;

        switch (data.connType) {
            case ConnectionTypes.Emulator:

                connection = layout.createEmulatorConnection(data.protocol as ConnectionProtocols, data.connName);
                break;


            case ConnectionTypes.Serial:
                if (data.path === undefined || data.baudRate === undefined) {
                    return new Response(JSON.stringify({ message: 'Missing required fields: path and baudRate are required for serial connections' }), { status: 400 });
                }

                connection = layout.createSerialConnection(data.protocol, data.path, data.baudRate, data.connName);
                break;



            default:
                return new Response(JSON.stringify({ message: 'Invalid connection type' }), { status: 400 });

        }

        return new Response(
            JSON.stringify({
                message: `Connection created successfully on layout: ${layout.name}`,
                connUUID: connection.uuid
            }),

            { status: 201 }

        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: `Invalid request body: ${error}` }),
            { status: 400 }
        );

    }
}