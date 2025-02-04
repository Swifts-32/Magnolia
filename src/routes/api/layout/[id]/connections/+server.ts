import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte';

export const GET = async ({ params }) => {
    let { id } = params; // Extract the dynamic parameter

    const layout = LayoutServerHandler.Layouts.get(id);

    if (layout) {
        const connections = [...layout.connections].map(([key, value]) => ({
            key,
            protocol: value.protocol
        }));

        return new Response(JSON.stringify({ message: connections }), { status: 200 });
    }
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
}