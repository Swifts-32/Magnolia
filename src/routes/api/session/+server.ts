import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
import { SessionTable } from '$lib/server/db/schema/sessions';

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function POST({ request }) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return new Response("Missing session id", { status: 400 });

  // cleanup old sessions
  await db.delete(SessionTable).where(sql`expires_at < now()`);

  // insert or update
  await db
    .insert(SessionTable)
    .values({
      id: sessionId,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS)
    })
    .onConflictDoUpdate({
      target: SessionTable.id,
      set: { expiresAt: new Date(Date.now() + SESSION_TTL_MS) }
    });

  return json({ ok: true });
}
