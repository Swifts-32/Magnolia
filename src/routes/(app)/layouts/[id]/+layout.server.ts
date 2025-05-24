import { db } from "$lib/server/db";
import { LayoutTable } from "$lib/server/db/schema/layouts";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";

export const load: LayoutServerLoad = async ({ params }) => {
  const layoutsDb = await db.select(
    {
      name: LayoutTable.name,
      id: LayoutTable.uuid,
    }
  )
    .from(LayoutTable)
    .where(eq(LayoutTable.uuid, params.id));

  const layoutDb = layoutsDb[0];
  // const layout = new LayoutClient(layoutDb.name, layoutDb.id as LayoutUUID);

  return {
    layoutName: layoutDb.name,
    layoutId: layoutDb.id as LayoutUUID,
  };
}