import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { LayoutServerLoad } from "./$types";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import { LayoutTable } from "$lib/server/db/schema/layouts";

export const load: LayoutServerLoad = async ({ params }) => {
  const { id } = params;

  // Validate that the parameters are a valid uuid
  const { error, data: layoutId } = z.uuidv4().safeParse(id);
  if (error) {
    throw redirect(307, "/");
  }

  const layoutsDb = await db.select(
    {
      name: LayoutTable.name,
      id: LayoutTable.uuid,
    }
  )
    .from(LayoutTable)
    .where(eq(LayoutTable.uuid, layoutId));

  if (layoutsDb.length < 1) {
    throw redirect(307, "/");
  }

  const layoutDb = layoutsDb[0];

  return {
    layoutName: layoutDb.name,
    layoutId: layoutDb.id as LayoutUUID,
  };
}