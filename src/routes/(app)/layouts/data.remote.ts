import { form, query } from "$app/server";
import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { db } from "$lib/server/db";
import { LayoutTable } from "$lib/server/db/schema/layouts";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const getLayouts = query(async () => {
  const layouts = await db.select({
    id: LayoutTable.uuid,
    name: LayoutTable.name,
  }).from(LayoutTable);

  return layouts;
});

export const createLayout = form(async (data: FormData) => {
  const layoutSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
  });
  const layoutData = layoutSchema.safeParse(Object.fromEntries(data));

  if (!layoutData.success) {
    return error(400, layoutData.error.message);
  }

  const layouts = await db.insert(LayoutTable).values({
    name: layoutData.data.name,
    position: 0,
  }).returning();

  const layout = layouts[0];
  LayoutServerHandler.addNewLayout(layout.name, layout.uuid as LayoutUUID, layout.position);

  await getLayouts().refresh();
  redirect(303, `/layouts/${layout.uuid}`);
});

export const deleteLayout = form(async (data: FormData) => {
  const layoutSchema = z.object({
    uuid: z.uuid()
  });
  const layoutData = layoutSchema.safeParse(Object.fromEntries(data));
  if (!layoutData.success) {
    return error(400, layoutData.error.message);
  }

  const res = await db.delete(LayoutTable).where(eq(LayoutTable.uuid, layoutData.data.uuid)).returning();

  if (res.length === 0) error(404, "Layout not found");
  redirect(303, `/`);
});