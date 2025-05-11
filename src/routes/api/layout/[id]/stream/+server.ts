import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
    const { id } = params;
    
    let layout = LayoutServerHandler.getLayout(id as LayoutUUID);
    if (!layout) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });

    return new Response(layout.createStream(), {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        }
    });
};