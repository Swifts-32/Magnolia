import { db } from "$lib/server/db/index.js";
import { LayoutTable } from "$lib/server/db/schema/layouts.js";
import { eq } from "drizzle-orm";

export const POST = async ({ request, params }) => {
  const { id } = params;

  const data = await request.json();

  await db.update(LayoutTable)
    .set({
      name: data.layoutName,
    })
    .where(eq(LayoutTable.uuid, id));

  return new Response(
    JSON.stringify({
      message: 'Layout updated successfully',
    }),
    { status: 200 }
  );
};
