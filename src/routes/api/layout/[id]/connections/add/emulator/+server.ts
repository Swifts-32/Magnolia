import { LayoutServerHandler } from '$lib/server/LayoutHandler.server.svelte.js';

export const POST = async ({ request, params }) => {
    const { id } = params;
    const layout = LayoutServerHandler.layouts.get(id);

    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    try {
        const data = await request.json();

        // Validate required fields
        if (!data.connName || !data.protocol || !data.connType) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: connName, protocol, and connType are required' }),
                { status: 400 }
            );
        }

        // Generate a unique key for the connection
        const connKey = `conn_${Date.now()}`;

        // Add the new connection to the layout
        layout.createDccEmulatorConnection(data.connName, data.protocol);

        return new Response(
            JSON.stringify({
                message: 'Connection created successfully',
                key: connKey
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