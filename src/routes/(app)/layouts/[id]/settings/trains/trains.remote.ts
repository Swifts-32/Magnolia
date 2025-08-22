import { form, query } from "$app/server";
import { db } from "$lib/server/db";
import { trainSchema, TrainTable } from "$lib/server/db/schema/trains";
import { ServerTrain } from "$lib/server/Trains/Train.server";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const getTrains = query(z.uuid(), async (layoutId) => {
  const trains = await db.select().from(TrainTable).where(eq(TrainTable.layoutUuid, layoutId));

  return trains;
});

export const createTrain = form(async (data: FormData) => {
  const trainData = trainSchema.safeParse(Object.fromEntries(data));

  if (!trainData.success) error(400, trainData.error.message);

  await db.insert(TrainTable).values({
    name: trainData.data.name,
    comment: trainData.data.comment,
    layoutUuid: trainData.data.layoutUuid,
    uuid: trainData.data.uuid,
    address: trainData.data.address || "",
  });


  await getTrains(trainData.data.layoutUuid).refresh();
});
