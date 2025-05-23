import type { LayoutUUID } from '$lib/client/LayoutClient.svelte';
import { LayoutServerHandler } from '$lib/server/layoutHandler.server.svelte';
import type { TrainUuid } from '$lib/types/Trains/Train.js';

export const GET = async ({ params }) => {
  let { id, trainUUID } = params; // Extract the dynamic parameter

  const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
  if (!layout) {
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  }
  const train = layout.getTrain(trainUUID as TrainUuid);

  if (train) {
    return new Response(JSON.stringify({ message: "Found train", train: train }), { status: 200 });
  }
  else {
    return new Response(JSON.stringify({ message: "Train does not exist" }), { status: 404 });
  }
}