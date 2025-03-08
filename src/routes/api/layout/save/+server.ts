import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte';

export const GET = async () => {
  LayoutServerHandler.saveLayouts();

  return new Response(JSON.stringify({ message: "Layouts saved." }), { status: 200 });
}