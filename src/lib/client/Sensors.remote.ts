import { command, form, query } from "$app/server";
import { db } from "#lib/server/db/index.js";
import {
  SensorTable,
  SensorInsertSchema,
  type Sensor,
} from "#lib/server/db/schema/sensors.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

async function getSensorFromDb(sensorId: string) {
  const sensors: Sensor[] = await db
    .select()
    .from(SensorTable)
    .where(eq(SensorTable.id, sensorId));

  if (sensors.length < 1 || sensors.length > 1) error(404, "Not found");

  return sensors[0];
}

export const getLayoutSensors = query(z.uuid(), async (layoutId) => {
  const sensors: Sensor[] = await db
    .select()
    .from(SensorTable)
    .orderBy(SensorTable.name)
    .where(eq(SensorTable.layoutId, layoutId));

  return sensors;
});

export const getSensor = query(z.uuid(), async (sensorId) => {
  return await getSensorFromDb(sensorId);
});

export const createSensor = form(
  SensorInsertSchema.omit({
    id: true,
  }),
  async (data) => {
    await db.insert(SensorTable).values({
      layoutId: data.layoutId,
      name: data.name,
      address: data.address,
      comment: data.comment || null,
      connectionId: data.connectionId ?? null,
      inverted: data.inverted ?? false,
      activationDelay: data.activationDelay ?? 0,
      deactivationDelay: data.deactivationDelay ?? 0,
    });

    await getLayoutSensors(data.layoutId).refresh();
  },
);

export const editSensor = form(
  SensorInsertSchema,
  async ({ layoutId, ...data }) => {
    await db
      .update(SensorTable)
      .set({
        layoutId,
        name: data.name,
        address: data.address,
        comment: data.comment || null,
        connectionId: data.connectionId ?? null,
        inverted: data.inverted ?? false,
        activationDelay: data.activationDelay ?? 0,
        deactivationDelay: data.deactivationDelay ?? 0,
      })
      .where(eq(SensorTable.id, data.id));

    await getLayoutSensors(layoutId).refresh();
  },
);

export const deleteSensor = command(z.uuid(), async (sensorId) => {
  const sensor = await getSensorFromDb(sensorId);

  const res = await db
    .delete(SensorTable)
    .where(eq(SensorTable.id, sensorId))
    .returning();

  if (res.length === 0) error(404, "Sensor not found");

  await getLayoutSensors(sensor.layoutId).refresh();
});

export const duplicateSensor = command(z.uuid(), async (sensorId) => {
  const sensor = await getSensorFromDb(sensorId);

  const { id, ...rest } = sensor;

  await db.insert(SensorTable).values({
    ...rest,
    name: `${sensor.name} (Copy)`,
  });

  await getLayoutSensors(sensor.layoutId).refresh();
});
