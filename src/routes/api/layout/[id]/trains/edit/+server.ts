import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { isTrainData } from "$lib/types/Trains/Train.js";

export const POST = async ({ request, params }) => {
    const { id } = params;

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    try {
        const data = await request.json();

        // Validate required fields
        if (!isTrainData(data)) {
            return new Response(
                JSON.stringify({ message: 'Failed to edit train: Invalid data' }),
                { status: 400 }
            );
        }

        // Get the new connection
        const newConn = layout.connections.get(data.connUUID);
        if (!newConn) {
            return new Response(JSON.stringify({ message: `Connection with uuid ${data.connUUID} not found` }), { status: 404 });
        }

        let train = layout.getTrain(data.uuid);

        if (!train) {
            return new Response(JSON.stringify({ message: `Train with uuid ${data.uuid} not found` }), { status: 404 });
        }

        // Update the train
        train.address = data.address;
        train.name = data.name;
        train.connUuid = data.connUUID;

        // Update trains functions
        data.functions.forEach(funct => {
            train.addFunction(funct.value, funct.name, funct.icon, funct.mode, funct.position);
        });

        newConn.trains.set(train.uuid, train);
        LayoutServerHandler.saveLayouts();

        return new Response(
            JSON.stringify({
                message: `Train updated successfully on layout: ${layout.name}`,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: `Invalid request body: ${error}` }),
            { status: 400 }
        );

    }
}