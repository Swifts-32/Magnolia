import { db } from "$lib/server/db/index.js";
import { TrainTable } from "$lib/server/db/schema/trains.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { ServerTrain } from "$lib/server/Trains/Train.server.js";

export const POST = async ({ request }) => {
  const data = await request.json();

  const train = ServerTrain.fromJsonWeb(data);
  if (!train) return new Response("Invalid train data", { status: 400 });

  const layout = LayoutServerHandler.getLayout(train.layoutUuid);
  if (!layout) return new Response("Layout not found", { status: 404 });

  await db.insert(TrainTable).values({
    name: train.name,
    comment: train.comment,
    layoutUuid: train.layoutUuid,
    uuid: train.uuid,
    address: train.address || "",
  });

  layout.addTrain(train);
  LayoutServerHandler.saveLayouts();

  return new Response(
    JSON.stringify({
      message: `Train created successfully`,
    }),
    { status: 201 }
  );
}