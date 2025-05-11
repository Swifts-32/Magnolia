import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { isTrainData } from "$lib/types/Trains/Train.js";

export const POST = async ({ request, params }) => {
    const { id } = params;
    const data = await request.json();

    const connection = LayoutServerHandler.layouts.get(id as LayoutUUID)?.connections.get(data.connUUID);
    if (!connection) {
        return new Response(JSON.stringify({ message: `${id} is not a valid connection.` }), { status: 404 });
    }

    // Validate required fields
    if (!isTrainData(data)) {
        return new Response(
            JSON.stringify({ message: 'Failed to create train: Invalid data' }),
            { status: 400 }
        );
    }

    let train = connection.addTrain(data.address, data.name, data.layoutUUID);
    if (!train) {
        return new Response(
            JSON.stringify({ message: 'Failed to create train: Train was null' }), { status: 404 }
        );
    }

    data.functions.forEach(funct => {
        train.addFunction(funct.value, funct.name, funct.icon, funct.mode, funct.position, true);
    });

    LayoutServerHandler.layouts.get(id as LayoutUUID)?.updateConnection(connection);
    LayoutServerHandler.saveLayouts();


    return new Response(
        JSON.stringify({
            message: `Train created successfully`,
        }),
        { status: 201 }
    );
}