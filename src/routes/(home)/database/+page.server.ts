import { db } from "$lib/server/db";
import { LayoutTable } from "$lib/server/db/schema/layouts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  await db.insert(LayoutTable).values({
    name: "Layout Test 1",
  });
  await db.insert(LayoutTable).values({
    name: "Layout Test 2",
    uuid: crypto.randomUUID()
  });

  console.log("Runnign");

  return {
    message: db.select().from(LayoutTable),
  }
}