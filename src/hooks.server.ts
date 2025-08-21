import { db } from "$lib/server/db";
import { SessionTable } from "$lib/server/db/schema/sessions";
import { type Handle } from "@sveltejs/kit";
import { sql } from "drizzle-orm";

const SESSION_COOKIE = "anon_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export const handle: Handle = async ({ event, resolve }) => {
  let sessionId = event.cookies.get(SESSION_COOKIE);

  if (!sessionId) {
    // Clean up expired ids.
    await db.delete(SessionTable).where(sql`expires_at < now()`);

    // Create new session
    const [newSession] = await db.insert(SessionTable).values({
      expiresAt: new Date(Date.now() + SESSION_TTL_MS)
    }).returning();

    sessionId = newSession.id;

    // Store in cookie
    event.cookies.set(SESSION_COOKIE, sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // secure: process.env.NODE.ENV === "production",
      maxAge: SESSION_TTL_MS / 1000
    })
  }

  // Attach sessionId to locals for use in routes
  event.locals.sessionId = sessionId;

  return resolve(event);
};