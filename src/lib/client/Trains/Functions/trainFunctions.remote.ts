import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { TrainFunctionTable } from "$lib/server/db/schema/trains";
import { TrainFunctionIcons, TrainFunctionModes } from "$lib/types/Trains/Functions/Functions";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { boolean, number, z } from "zod/v4";

// Schema with the function key
const trainFunctionSchema = z.object({
  value: z.string(),
  trainId: z.uuid(),
});

// Get the train's functions using the train id
async function getTrainFunctionsFromDb(trainId: string) {
  const trains: TrainFunction[] = await db.select().from(TrainFunctionTable).where(eq(TrainFunctionTable.trainId, trainId));
  return trains;
}

export const getTrainFunctions = query(z.uuid(), async (trainId) => {

  const functions = await getTrainFunctionsFromDb(trainId);

  // For svelte dnd
  return functions.map(fn => ({
    ...fn,
    id: fn.value,
  }));
});

export const setTrainFunctionPosition = command(trainFunctionSchema.extend({
  position: z.number(),
}), async ({ trainId, value, position }) => {

  await db.update(TrainFunctionTable).set({
    position
  }).where(and(eq(TrainFunctionTable.value, value), eq(TrainFunctionTable.trainId, trainId)))

  getTrainFunctions(trainId).refresh();
});

export const getTrainFunction = query(trainFunctionSchema, async (data) => {
  const trains: TrainFunction[] = await db.select().from(TrainFunctionTable)
    .where(and(eq(TrainFunctionTable.value, data.value), eq(TrainFunctionTable.trainId, data.trainId)));

  return trains[0];
});


export const deleteTrainFunction = command(trainFunctionSchema, async (data) => {
  const res = await db.delete(TrainFunctionTable)
    .where(and(eq(TrainFunctionTable.value, data.value), eq(TrainFunctionTable.trainId, data.trainId)))
    .returning();

  if (res.length === 0) error(404, "Train function not found");

  await getTrainFunctions(data.trainId).refresh();
});

// Create a default function with the train Id
export const createDefaultTrainFunction = command(z.uuid(), async (trainId) => {
  const functions = await getTrainFunctionsFromDb(trainId);
  // Select a function value (numerical) that is not already in use
  let i = 0;
  while (functions.some(fn => fn.value === `F${i}`)) {
    i++;
  }

  await db.insert(TrainFunctionTable).values({
    trainId,
    value: `F${i}`,
    name: `New Function ${i}`
  });

  await getTrainFunctions(trainId).refresh();
});

const toggleTrainFunctionSchema = z.object({
  value: z.string(),
  trainId: z.uuid(),
  state: z.boolean(),
});
export const toggleTrainFunction = command(toggleTrainFunctionSchema, async (data) => {
  await db.update(TrainFunctionTable).set({
    state: data.state,
  }).where(and(eq(TrainFunctionTable.value, data.value), eq(TrainFunctionTable.trainId, data.trainId)));

  await getTrainFunction({
    trainId: data.trainId,
    value: data.value,
  }).refresh();
})

const selectTrainFunctionSchema = z.object({
  value: z.string(),
  trainId: z.uuid(),
});
export const selectTrainFunction = command(selectTrainFunctionSchema, async (data) => {
  // Update connection

  await getTrainFunctions(data.trainId).refresh();

})

const etrainFunctionSchema = z.object({
  value: z.string(),
  trainId: z.uuid(),
  name: z.string().trim().max(255),
  icon: TrainFunctionIcons.default("Text"),
  mode: TrainFunctionModes.default("Toggle"),
  visible: boolean().default(true),
  position: number().min(0).default(0),
  state: boolean().default(false),
  id: z.string().optional(),
});


export type TrainFunction = z.infer<typeof etrainFunctionSchema>

export const addTrainFunction = command(etrainFunctionSchema, async (
  { value, trainId, name, icon, mode, visible, position, state }
) => {
  await db.insert(TrainFunctionTable).values({
    value,
    icon,
    mode,
    name,
    position,
    state,
    trainId,
    visible,
  });

  await getTrainFunctions(trainId).refresh();
});

export const editTrainFunction = command(etrainFunctionSchema, async (
  { value, trainId, name, icon, mode, visible, position, state }
) => {
  await db.update(TrainFunctionTable).set({
    icon,
    mode,
    name,
    position,
    state,
    trainId,
    visible,
  }).where(and(eq(TrainFunctionTable.value, value), eq(TrainFunctionTable.trainId, trainId)));

  await getTrainFunctions(trainId).refresh();
});

