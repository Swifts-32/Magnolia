import { LayoutServerHandler } from "$lib/server/LayoutHandler.server.svelte";

export const GET = async () => {
    return new Response(JSON.stringify(Array.from(LayoutServerHandler.layouts.entries())), { status: 200 });
}