import { ConnectionProtocols } from "$lib/client/Protocols/protocols.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    // const param = url.searchParams.get("name");

    // if (param) {
    //     if (LayoutServerHandler.layouts.has(param)) {
    //         return json(JSON.stringify(LayoutServerHandler.layouts.get(param)));
    //     }
    //     return json(null);
    // }
    // else {
    return new Response(JSON.stringify(Array.from(LayoutServerHandler.layouts.entries())), { status: 200 });
    // }


    //TODO Remove add Layout handler
}