import { ConnectionTypes } from "$lib/client/Protocols/protocols";
import { EmulatorConnection } from "$lib/server/Connections/Hardware/Emulator/Emulator.server.js";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server.js";
import { LayoutServerHandler } from "$lib/server/LayoutHandler.server.svelte";

export const POST = async ({ request, params }) => {
    const { id, connUUID } = params;
    const layout = LayoutServerHandler.layouts.get(id);

    if (!layout) {
        return new Response(
            JSON.stringify({ message: `${id} is not a valid layout.` }),
            { status: 404 }
        );
    }

    const connection = layout.connections.get(connUUID);
    if (!connection) {
        return new Response(
            JSON.stringify({ message: `Connection ${connUUID} not found.` }),
            { status: 404 }
        );
    }

    try {
        const data = await request.json();

        // Update basic connection properties
        if (data.connName) connection.name = data.connName;
        if (data.protocol) connection.protocol = data.protocol;

        // Update type-specific properties

        switch (data.connType) {
            case ConnectionTypes.Serial: {
                connection.hardware = new SerialConnection(data.path, data.baudRate);
                break;
            }
            case ConnectionTypes.Emulator: {
                connection.hardware = new EmulatorConnection();
                break;
            }


            default:
                return new Response(
                    JSON.stringify({ message: `Invalid connection type: ${data.connType}` }),
                    { status: 400 }
                );
        }

        // Update the connection in the layout
        layout.connections.set(connUUID, connection);
        LayoutServerHandler.saveLayouts();
        
        return new Response(
            JSON.stringify({
                message: 'Connection updated successfully',
                connection
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Invalid request body' }),
            { status: 400 }
        );
    }
};
