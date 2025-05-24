import { db } from "$lib/server/db/index.js";
import { LayoutTable } from "$lib/server/db/schema/layouts.js";
import { eq } from "drizzle-orm";

export const GET = async ({ params }) => {
    const { id } = params; // Extract the dynamic parameter

    await db.delete(LayoutTable).where(eq(LayoutTable.uuid, id));

    return new Response(JSON.stringify({ message: "Layout deleted." }), { status: 200 });
}