import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { TrainFunctionTable, type TrainFunction } from "$lib/server/db/schema/trains";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";

// Get the train's functions using the train id

async function getTrainFunctionsFromDb(trainId: string) {
  const trains: TrainFunction[] = await db.select().from(TrainFunctionTable).where(eq(TrainFunctionTable.trainUuid, trainId));
  return trains;
}

export const getTrainFunctions = query(z.uuid(), async (trainId) => {
  return await getTrainFunctionsFromDb(trainId);
});

const trainFunctionSchema = z.object({
  value: z.string(),
  trainId: z.uuid(),
});


export const deleteTrainFunction = command(trainFunctionSchema, async (data) => {
  const res = await db.delete(TrainFunctionTable)
    .where(and(eq(TrainFunctionTable.functValue, data.value), eq(TrainFunctionTable.trainUuid, data.trainId)))
    .returning();

  if (res.length === 0) error(404, "Train function not found");

  await getTrainFunctions(data.trainId).refresh();
});

// Create a default function with the train Id
export const createDefaultTrainFunction = command(z.uuid(), async (trainId) => {
  const functions = await getTrainFunctionsFromDb(trainId);
  // Select a function value (numerical) that is not already in use
  let i = 0;
  while (functions.some(fn => fn.functValue === `F${i}`)) {
    i++;
  }

  await db.insert(TrainFunctionTable).values({
    trainUuid: trainId,
    functValue: `F${i}`,
    name: `New Function ${i}`
  });

  await getTrainFunctions(trainId).refresh();
});

