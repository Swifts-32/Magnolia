import { db } from "$lib/server/db";
import { UserTable } from "$lib/server/db/schema/users";
import type { RequestHandler } from "@sveltejs/kit";
import { z } from "zod/v4";

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();

  try {
    const clientId = z.uuidv4().parse(data.clientId);

    await db.insert(UserTable).values({
      id: clientId,
      name: "Automated"
    });

    return new Response("OK")
  }
  catch (err) {
    return new Response("Failed to add client");
  }
}