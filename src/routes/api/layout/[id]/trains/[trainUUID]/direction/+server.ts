import { TrainDirection } from "$lib/client/Trains/Train.svelte";
import { ServerTrain } from "$lib/server/Trains/Train.server.js";
import type { TrainUuid } from "$lib/types/Trains/Train";

export const POST = async ({ request, params }) => {
  const data = await request.json();

  const direction = TrainDirection.parse(data.direction);
  const trainId = params.trainUUID as TrainUuid;

  await ServerTrain.setTrainDirection(trainId, direction);

  return new Response("Set train direction");
}