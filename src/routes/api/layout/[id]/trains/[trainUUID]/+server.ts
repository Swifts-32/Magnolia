import { ServerTrain } from '$lib/server/Trains/Train.server.js';
import type { TrainUuid } from '$lib/types/Trains/Train.js';

export const GET = async ({ params }) => {
  const { trainUUID } = params;

  const train = await ServerTrain.getTrainFromDb(trainUUID as TrainUuid);

  if (train) {
    return new Response(JSON.stringify({ message: "Found train", train: train.toJsonWeb() }), { status: 200 });
  }
  else {
    return new Response(JSON.stringify({ message: "Train does not exist" }), { status: 404 });
  }
}