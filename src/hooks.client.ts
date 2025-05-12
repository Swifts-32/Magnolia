import type { ClientInit } from "@sveltejs/kit";
import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler.svelte";

export const init: ClientInit = async () => {
    layoutClientHandler.loadLayouts();
    layoutClientHandler.connectToSse();

    window.addEventListener("beforeunload", (event) => {
        fetch("/api/layout/save");
    });
}