import type { LayoutUUID } from '$lib/client/LayoutClient.svelte';
import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte';

export const GET = async ({ params }) => {
    let { id } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    const connections = Array.from(layout.connections.values());
    const trains = connections.flatMap(conn => Array.from(conn.trains.values()).map(train => train.toJSON()));

    return new Response(JSON.stringify({ message: trains }), { status: 200 });
}