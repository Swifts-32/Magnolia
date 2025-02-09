import type { LayoutUUID } from '$lib/client/LayoutClient.svelte';
import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte';

export const GET = async ({ params }) => {
    let { id } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: Array.from(layout.connections.values()).map(conn => Array.from(conn.trains.values()).map(train => train.toJSON())) }), { status: 200 });
}