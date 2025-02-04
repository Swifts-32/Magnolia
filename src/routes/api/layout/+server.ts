import { ConnectionProtocols } from "$lib/client/Protocols/protocols.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    const param = url.searchParams.get("name");

    if (param) {
        if (LayoutServerHandler.Layouts.has(param)) {
            return json(JSON.stringify(LayoutServerHandler.Layouts.get(param)));
        }
        return json(null);
    }
    else {
        return json(JSON.stringify(Array.from(LayoutServerHandler.Layouts.entries())));
    }

    //TODO Remove add Layout handler
}