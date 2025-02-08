import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const POST = async ({ request, params }) => {
    const { id } = params;

    const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
    if (!layout) {
        return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
    }

    try {
        const data = await request.json();

        // Validate required fields
        if (data.address === undefined || data.name === undefined || data.connUUID === undefined || data.uuid === undefined) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: address, name, connUUID, and uuid are required' }),
                { status: 400 }
            );
        }


        let train = layout.trains.get(data.uuid);
        if (!train) {
            return new Response(JSON.stringify({ message: `Train with uuid ${data.uuid} not found` }), { status: 404 });
        }

        // Update the train
        train.address = data.address;
        train.name = data.name;
        train.connUUID = data.connUUID;

        // Add functions to the train

        //TODO Add functions
        if (data.functions) {}


        return new Response(
            JSON.stringify({
                message: `Train created successfully on layout: ${layout.name}`,
                trainUUID: train.uuid

            }),
            { status: 201 }

        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: `Invalid request body: ${error}` }),
            { status: 400 }
        );

    }
}