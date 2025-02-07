import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte.js';

export const POST = async ({ request }) => {
    try {
        const data = await request.json();

        // Validate required fields
        if (data.layoutName == undefined) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: layoutName is required' }),
                { status: 400 }
            );
        }

        LayoutServerHandler.addNewLayout(data.layoutName);

        return new Response(
            JSON.stringify({
                message: 'Layout created successfully',
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