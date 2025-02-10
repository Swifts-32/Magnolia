import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import type { ServerInit } from "@sveltejs/kit";

export const init: ServerInit = async () => {
    process.on("sveltekit:shutdown", async (reason) => {
        console.log("Shutting down server:", reason);
        LayoutServerHandler.shutdown();
    });

}