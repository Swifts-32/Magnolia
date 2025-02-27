import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { isTrainData } from "$lib/types/Trains/Train.js";

export const POST = async ({ request, params }) => {
    const { id } = params;

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    const data = await request.json();

    // Validate required fields
    if (!isTrainData(data)) {
        return new Response(
            JSON.stringify({ message: 'Failed to create train: Invalid data' }),
            { status: 400 }
        );
    }

    let train = layout.addTrain(data.address, data.name, data.connUUID);
    if (!train) {
        return new Response(
            JSON.stringify({ message: 'Failed to create train: Train was null' }), { status: 404 }
        );
    }

    data.functions.forEach(funct => {
        train.addFunction(funct.value, funct.name, funct.icon, funct.mode, funct.position);
    });


    return new Response(
        JSON.stringify({
            message: `Train created successfully on layout: ${layout.name}`,
        }),
        { status: 201 }
    );
}