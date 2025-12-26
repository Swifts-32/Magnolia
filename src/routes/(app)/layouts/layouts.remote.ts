import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { LayoutTable } from "$lib/server/db/schema/layouts";
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

export const getLayout = query(z.uuid(), async (id) => {
  const layouts = await db.select({
    id: LayoutTable.uuid,
    name: LayoutTable.name,
  }).from(LayoutTable).where(eq(LayoutTable.uuid, id));

  if (layouts.length < 1 || layouts.length > 1) error(404, "Not found");

  return layouts[0];
});

export const createLayout = form(
  z.object({
    name: z.string().trim().min(1, "Name is required"),
  }),
  async ({ name }) => {
    const layouts = await db.insert(LayoutTable).values({
      name,
      position: 0,
    }).returning();

    const layout = layouts[0];

    await getLayouts().refresh();
    redirect(303, `/layouts/${layout.uuid}`);
  });

export const deleteLayout = command(z.uuid(), async (layoutId) => {
  const res = await db.delete(LayoutTable).where(eq(LayoutTable.uuid, layoutId)).returning();

  if (res.length === 0) error(404, "Layout not found");
  await getLayouts().refresh();
});