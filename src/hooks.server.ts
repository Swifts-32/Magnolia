import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/auth/Session";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("session") ?? null;

  if (event.url.pathname.startsWith("/login")) {
    return resolve(event);
  }


  if (!token) {
    return redirect(307, `${event.url.origin}/login`);
  }

  const { session, user } = await validateSessionToken(token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  console.log("Handling request for:", event.cookies.get("session"));

  return resolve(event);
};