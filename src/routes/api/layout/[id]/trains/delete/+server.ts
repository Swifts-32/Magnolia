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
        if (data.uuid === undefined) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: uuid is required' }),
                { status: 400 }
            );
        }

        layout.trains.delete(data.uuid);

        return new Response(
            JSON.stringify({
                message: `Train deleted successfully on layout: ${layout.name}`,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: `Invalid request body: ${error}` }),
            { status: 400 }
        );

    }
}