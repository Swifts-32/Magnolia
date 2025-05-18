import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { ServerTrain } from "$lib/server/Trains/Train.server.js";

export const POST = async ({ request }) => {
  const data = await request.json();

  const train = ServerTrain.fromJsonWeb(data);
  if (!train) return new Response("Invalid train data", { status: 400 });

  const layout = LayoutServerHandler.getLayout(train.layoutUuid);
  if (!layout) return new Response("Layout not found", { status: 404 });

  layout.addTrain(train);
  LayoutServerHandler.saveLayouts();

  return new Response(
    JSON.stringify({
      message: `Train created successfully`,
    }),
    { status: 201 }
  );
}