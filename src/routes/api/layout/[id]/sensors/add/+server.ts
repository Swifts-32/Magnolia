import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, params }) => {
  const layout = LayoutServerHandler.getLayout(params.id as LayoutUUID);
  if (!layout) return new Response("Layout not found", { status: 404 });

  const data = await request.json();

  layout.createSensor(data.name);

  return new Response("Created sensor", { status: 201 });
}