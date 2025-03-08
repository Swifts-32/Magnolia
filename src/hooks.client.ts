import type { ClientInit } from "@sveltejs/kit";
import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler.svelte";

export const init: ClientInit = async () => {
    console.log("Client Init");
    layoutClientHandler.refreshLayouts();

    window.addEventListener("beforeunload", (event) => {
        fetch("/api/layout/save");
        console.log("Client Unload");
    });
}