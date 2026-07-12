import { type Handle, type HandleValidationError } from "@sveltejs/kit";


if (typeof crypto !== "undefined" && !crypto.randomUUID) {
  crypto.randomUUID = () =>
    (
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    ) as `${string}-${string}-${string}-${string}-${string}`
}
else {
  console.log("Crypto exists");
}


export const handle: Handle = async ({ event, resolve }) => {
  // look for tab session id in headers
  const sessionId = event.request.headers.get("x-session-id");

  if (sessionId) {
    event.locals.sessionId = sessionId;
  } else {
    event.locals.sessionId = null;
  }

  return resolve(event);
};

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
  return {
    message: `Validation error: ${event} ${issues}`
  };
};

// const SESSION_COOKIE = "anon_session";
// const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24h

// export const handle: Handle = async ({ event, resolve }) => {
//   let sessionId = event.cookies.get(SESSION_COOKIE);

//   if (!sessionId) {
//     // Clean up expired ids.
//     await db.delete(SessionTable).where(sql`expires_at < now()`);

//     // Create new session
//     const [newSession] = await db.insert(SessionTable).values({
//       expiresAt: new Date(Date.now() + SESSION_TTL_MS)
//     }).returning();

//     sessionId = newSession.id;

//     // Store in cookie
//     event.cookies.set(SESSION_COOKIE, sessionId, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "lax",
//       // secure: process.env.NODE.ENV === "production",
//       maxAge: SESSION_TTL_MS / 1000
//     })
//   }

//   // Attach sessionId to locals for use in routes
//   event.locals.sessionId = sessionId;

//   return resolve(event);
// };