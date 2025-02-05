import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte';

export const GET = async ({ params }) => {
    let { id } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.layouts.get(id);

    if (layout) {
        const connections = [...layout.connections].map(([key, value]) => ({
            key,
            protocol: value.protocol,
            connName: value.name,
            connType: value.hardware.connType,
        }));


        return new Response(JSON.stringify({ message: connections }), { status: 200 });
    }
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
}