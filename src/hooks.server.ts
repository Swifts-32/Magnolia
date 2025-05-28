import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/auth/Session";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {

  if (event.url.pathname.startsWith("/login")) {
    return resolve(event);
  }

  const token = event.cookies.get("session") ?? null;
  if (token == null) {
    event.locals.user = null;
    event.locals.session = null;

    return redirect(307, `/login`);
  }

  const { session, user } = await validateSessionToken(token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  if (!session || !user) {
    return redirect(307, `/login`);
  }

  event.locals.session = session;
  event.locals.user = user;

  return resolve(event);
};