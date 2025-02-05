import type { ClientInit } from "@sveltejs/kit";
import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler";

export const init: ClientInit = async () => {
    const json = await fetch("/api/layout").then(res => res.json());
    const layouts = json.map(([name, _config]: [LayoutUUID, any]) => ({ name }));

    for (const layout of layouts) {
        layoutClientHandler.addLayout(await LayoutClient.create(layout.name, fetch));
    }

    console.log("Client Init");
}