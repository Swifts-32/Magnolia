import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const POST = async ({ request, params }) => {
    const { id } = params;
    let layout = LayoutServerHandler.layouts.get(id as LayoutUUID);

    if (!layout) {
        return new Response(
            JSON.stringify({ message: `${id} is not a valid layout.` }),
            { status: 404 }
        );
    }

    try {
        const data = await request.json();

        // Update basic connection properties
        if (data.layoutName) layout.name = data.layoutName;
        LayoutServerHandler.saveLayouts();

        return new Response(
            JSON.stringify({
                message: 'Layout updated successfully',
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
