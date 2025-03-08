import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import type { TrainUUID } from "$lib/types/Trains/Train";
import { isFunctionData } from "$lib/types/Trains/Functions/Functions.js";

export const POST = async ({ request, params }) => {
    const { id, trainUUID } = params;

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    let train = layout.getTrain(trainUUID as TrainUUID);
    if (!train) {
        return new Response(JSON.stringify({ message: `${trainUUID} is not a valid train.` }), { status: 404 });
    }

    const data = await request.json();

    if (!isFunctionData(data)) {
        return new Response(
            JSON.stringify({ message: `Invalid function data: ${data}` }),
            { status: 400 }
        );
    }


    train.addFunction(data.value, data.name, data.icon, data.mode, data.position, data.layoutUUID, data.visible);

    LayoutServerHandler.saveLayouts();

    return new Response(
        JSON.stringify({
            message: `Function edited successfully on train: ${train.name}`,
        }),
        { status: 201 }
    );
}