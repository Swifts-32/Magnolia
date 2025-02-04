import { ConnectionProtocols } from "$lib/client/Protocols/protocols";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import type { ServerInit } from "@sveltejs/kit";

export const init: ServerInit = async () => {
    LayoutServerHandler.addNewLayout("L1");
    let layout = LayoutServerHandler.Layouts.get("L1");
    if (!layout) return;

    layout.createDccEmulatorConnection(ConnectionProtocols.DCCEX);
    // layout.createDccSerialConnection(ConnectionProtocols.DCCEX, "COM4", 115200);

    console.log("Server Init");
}