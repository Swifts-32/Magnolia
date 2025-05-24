import { ServerTrain } from "$lib/server/Trains/Train.server.js";
import type { TrainUuid } from "$lib/types/Trains/Train";
import { z } from "zod/v4";

export const POST = async ({ request, params }) => {
  const data = await request.json();

  const speed = z.int().parse(data.speed);
  const trainId = params.trainUUID as TrainUuid;

  await ServerTrain.setTrainSpeed(trainId, speed);

  return new Response("Set train speed");
}