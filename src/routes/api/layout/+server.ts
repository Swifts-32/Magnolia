import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const GET = async () => {
    return new Response(JSON.stringify(Array.from(LayoutServerHandler.layouts.values()).map(layout => layout.toJSON())), { status: 200 });
}