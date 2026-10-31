import { command, query } from "$app/server";
import { db } from "#lib/server/db/index.js";
import { TrainFunctionTable } from "#lib/server/db/schema/trains.js";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { TrainFunction } from "#lib/types/TrainFunctions.js";

// Get the train's functions using the train id
async function getTrainFunctionsFromDb(trainId: string) {
  const trains: TrainFunction[] = await db
    .select()
    .from(TrainFunctionTable)
    .where(eq(TrainFunctionTable.trainId, trainId));
  return trains;
}

export const getTrainFunctions = query(z.uuid(), async (trainId) => {
  const functions = await getTrainFunctionsFromDb(trainId);
  return functions;
});

export const setTrainFunctionPosition = command(
  z.object({
    id: z.uuid(),
    position: z.number(),
  }),
  async ({ id, position }) => {
    const res = await db
      .update(TrainFunctionTable)
      .set({
        position,
      })
      .where(eq(TrainFunctionTable.id, id))
      .returning();

    if (res.length === 0) error(404, "Train function not found");

    getTrainFunctions(res[0].trainId).refresh();
  },
);

export const getTrainFunction = query(z.uuid(), async (id) => {
  const trains: TrainFunction[] = await db
    .select()
    .from(TrainFunctionTable)
    .where(eq(TrainFunctionTable.id, id));

  return trains[0];
});

export const deleteTrainFunction = command(z.uuid(), async (id) => {
  const res = await db
    .delete(TrainFunctionTable)
    .where(eq(TrainFunctionTable.id, id))
    .returning();

  if (res.length === 0) error(404, "Train function not found");

  await getTrainFunctions(res[0].trainId).refresh();
});

// Create a default function with the train Id
export const createDefaultTrainFunction = command(z.uuid(), async (trainId) => {
  const functions = await getTrainFunctionsFromDb(trainId);
  // Select a function value (numerical) that is not already in use
  let i = 0;
  while (functions.some((fn) => fn.value === `F${i}`)) {
    i++;
  }

  await db.insert(TrainFunctionTable).values({
    trainId,
    value: `F${i}`,
    name: `New Function ${i}`,
  });

  await getTrainFunctions(trainId).refresh();
});

export const toggleTrainFunction = command(
  z.object({
    id: z.uuid(),
    state: z.boolean(),
  }),
  async ({ id, state }) => {
    const res = await db
      .update(TrainFunctionTable)
      .set({
        state,
      })
      .where(eq(TrainFunctionTable.id, id))
      .returning();

    if (res.length === 0) error(404, "Train function not found");

    getTrainFunctions(res[0].trainId).refresh();
  },
);

export const selectTrainFunction = command(z.uuid(), async (id) => {
  // TODO Update connection
  // await getTrainFunctions(data.trainId).refresh();
});

export const addTrainFunction = command(
  TrainFunction,
  async ({
    id,
    value,
    trainId,
    name,
    icon,
    mode,
    visible,
    position,
    state,
  }) => {
    await db.insert(TrainFunctionTable).values({
      id,
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
  },
);

export const editTrainFunction = command(
  TrainFunction,
  async ({
    id,
    value,
    trainId,
    name,
    icon,
    mode,
    visible,
    position,
    state,
  }) => {
    await db
      .update(TrainFunctionTable)
      .set({
        value,
        icon,
        mode,
        name,
        position,
        state,
        trainId,
        visible,
      })
      .where(eq(TrainFunctionTable.id, id));

    await getTrainFunctions(trainId).refresh();
  },
);
