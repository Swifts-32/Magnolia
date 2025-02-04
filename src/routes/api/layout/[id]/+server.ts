import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {

    const { id } = params;
    if (!id) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });

    let layout = LayoutServerHandler.layouts.get(id);
    if (!layout) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });

    console.log("Creating New Stream");

    return new Response(layout.createStream(), {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        }
    });

};