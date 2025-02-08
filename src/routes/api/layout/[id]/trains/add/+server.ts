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
        if (data.address === undefined || data.name === undefined || data.connUUID === undefined) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields: address, name, and connUUID are required' }),
                { status: 400 }
            );
        }

        let train = layout.addTrain(data.address, data.name, data.connUUID);

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