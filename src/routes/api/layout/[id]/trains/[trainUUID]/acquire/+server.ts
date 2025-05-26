import { ServerTrain } from '$lib/server/Trains/Train.server';
import type { TrainUuid } from '$lib/types/Trains/Train';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { trainUUID } = params;

  const train = await ServerTrain.acquireTrain(trainUUID as TrainUuid);

  if (train) {
    return new Response(JSON.stringify({ message: "Found train", train: train.toJsonWeb() }), { status: 200 });
  }
  else {
    return new Response(JSON.stringify({ message: "Train does not exist" }), { status: 404 });
  }
};