import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const GET = async ({ params }) => {
  const { id } = params;

  const layout = LayoutServerHandler.getLayout(id as LayoutUUID);

  return new Response(layout?.createStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
};