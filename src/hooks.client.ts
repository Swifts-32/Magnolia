import type { ClientInit } from "@sveltejs/kit";
import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler";

export const init: ClientInit = async () => {
    const json = await fetch("/api/layout").then(res => res.json());
    const layouts = json.map(([uuid, config]: [LayoutUUID, any]) => ({ uuid, config }));


    for (const layout of layouts) {
        const layoutClient = await LayoutClient.create(layout.uuid, fetch);
        layoutClientHandler.addLayout(layoutClient);
    }

    console.log("Client Init");
}