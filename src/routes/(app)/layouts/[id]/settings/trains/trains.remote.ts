import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { TrainTable, type Train } from "$lib/server/db/schema/trains";
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

export const createTrain = form(async (data: FormData) => {
  const trainSchema = z.object({
    layoutUuid: z.uuid(),
    address: z.string().trim().min(1),
    name: z.string().trim().min(1).max(255),
    comment: z.string().trim().min(1).max(255),
    connectionId: z.uuid(),
  });
  const trainData = trainSchema.safeParse(Object.fromEntries(data));
  if (!trainData.success) error(400, z.prettifyError(trainData.error));

  await db.insert(TrainTable).values({
    name: trainData.data.name,
    comment: trainData.data.comment,
    layoutUuid: trainData.data.layoutUuid,
    address: trainData.data.address,
    connectionUuid: trainData.data.connectionId,
  });


  await getTrains(trainData.data.layoutUuid).refresh();
});

export const editTrain = form(async (data: FormData) => {
  const trainSchema = z.object({
    layoutUuid: z.uuid(),
    address: z.string().trim().min(1),
    name: z.string().trim().min(1).max(255),
    comment: z.string().trim().min(1).max(255),
  });
  const trainData = trainSchema.safeParse(Object.fromEntries(data));

  if (!trainData.success) error(400, trainData.error.message);

  await db.insert(TrainTable).values({
    name: trainData.data.name,
    comment: trainData.data.comment,
    layoutUuid: trainData.data.layoutUuid,
    uuid: crypto.randomUUID(),
    address: trainData.data.address,
  });


  await getTrains(trainData.data.layoutUuid).refresh();
});

// Delete train using the trainId
export const deleteTrain = command(z.uuid(), async (trainId) => {
  const train = await getTrainFromDb(trainId);

  const res = await db.delete(TrainTable).where(eq(TrainTable.uuid, trainId)).returning();

  if (res.length === 0) error(404, "Train not found");

  await getTrains(train.layoutUuid).refresh();
});
