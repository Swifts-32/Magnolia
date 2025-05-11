import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const GET = async () => {
    return new Response(LayoutServerHandler.toWebJson(), { status: 200 });
}