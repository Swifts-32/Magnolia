import { command, form, query } from "$app/server";
import { App } from "$lib/server/App.server.svelte";
import { DccEx } from "$lib/server/Connections/Protocol/DccEx/DccEx";
import { db } from "$lib/server/db";
import { TrainTable, type Train } from "$lib/server/db/schema/trains";
import { TrainDirection } from "$lib/types/Trains/Train";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

async function getTrainFromDb(trainId: string) {
  const trains: Train[] = await db.select().from(TrainTable).where(eq(TrainTable.uuid, trainId));

  if (trains.length < 1 || trains.length > 1) error(404, "Not found");

  return trains[0];
}

export const getTrains = query(z.uuid(), async (layoutId) => {
  const trains: Train[] = await db.select().from(TrainTable).where(eq(TrainTable.layoutUuid, layoutId));

  return trains;
});

export const getTrain = query(z.uuid(), async (trainId) => {
  return await getTrainFromDb(trainId);
});

export const createTrain = form(z.object({
  layoutId: z.uuid(),
  address: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255),
  comment: z.string().trim().min(1).max(255),
  connectionId: z.uuid(),
}), async ({ name, address, comment, connectionId, layoutId }) => {

  await db.insert(TrainTable).values({
    name,
    comment,
    layoutUuid: layoutId,
    address,
    connectionUuid: connectionId,
  });


  await getTrains(layoutId).refresh();
});

export const editTrain = form(z.object({
  layoutId: z.uuid(),
  uuid: z.uuid(),
  address: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255),
  comment: z.string().trim().min(1).max(255),
  connectionId: z.uuid().optional(),
}),
  async ({ address, comment, connectionId, layoutId, name, uuid }) => {
    await db.update(TrainTable).set({
      name,
      comment,
      layoutUuid: layoutId,
      uuid: crypto.randomUUID(),
      address,
      connectionUuid: connectionId,
    }).where(eq(TrainTable.uuid, uuid));


    await getTrains(layoutId).refresh();
  });

// Delete train using the trainId
export const deleteTrain = command(z.uuid(), async (trainId) => {
  const train = await getTrainFromDb(trainId);

  const res = await db.delete(TrainTable).where(eq(TrainTable.uuid, trainId)).returning();

  if (res.length === 0) error(404, "Train not found");

  await getTrains(train.layoutUuid).refresh();
});

// Set the trains speed and direction
const trainMotionSchema = z.object({
  trainId: z.uuid(),
  speed: z.number(),
  direction: TrainDirection,
});

export const setTrainMotion = command(trainMotionSchema, async (data) => {

  // TODO Validate user is allowed to control
  await db.update(TrainTable).set({
    speed: data.speed,
    direction: data.direction,
  }).where(eq(TrainTable.uuid, data.trainId));

  const train = await getTrainFromDb(data.trainId);

  const connection = await App.getConnection(train.connectionUuid ?? "");
  if (!connection) error(500, "Set train motion failed: Connection not found");

  if ((connection.protocol instanceof DccEx)) {
    const dirBit = train.direction === "Forward" ? 1 : 0;
    connection.write(`<t ${train.address} ${train.speed} ${dirBit}>`);
  }
  else {
    error(500, `Set train motion failed: Protocol no yet implemented: ${connection.protocol?.protocolType}`);
  }

  await getTrain(data.trainId).refresh();
});

export const trainEmergencyStop = command(z.uuid(), async (trainId) => {
  const train = await getTrainFromDb(trainId);

  // TODO Validate user is allowed to control

  await db.update(TrainTable).set({
    speed: 0,
    direction: "Forward",
  }).where(eq(TrainTable.uuid, trainId));

  const connection = await App.getConnection(train.connectionUuid ?? "");
  if (!connection) error(500, "Emergency stop failed: Connection not found");

  if ((connection.protocol instanceof DccEx)) {
    connection.write(`<!>`);
  }
  else {
    error(500, `Emergency stop failed: Protocol no yet implemented: ${connection.protocol?.protocolType}`);
  }

  await getTrain(trainId).refresh();
});
