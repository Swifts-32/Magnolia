import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
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
        if (!data.connName || !data.protocol) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: connName and protocol are required' }),
                { status: 400 }
            );
        }


        // Add the new connection to the layout
        layout.createEmulatorConnection(data.connName, data.protocol);

        return new Response(
            JSON.stringify({
                message: 'Emulator connection created successfully',
            }),
            { status: 201 }

        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Invalid request body' }),
            { status: 400 }
        );
    }
}