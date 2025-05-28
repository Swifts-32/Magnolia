import { createSession, deleteSessionTokenCookie, generateSessionToken, setSessionTokenCookie, validateSessionToken } from '$lib/server/auth/Session';
import { layoutClientHandler } from '../../../services/Layouts/LayoutClientHandler.svelte';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = (async (event) => {
  const token = event.cookies.get("session") ?? null;

  if (!layoutClientHandler.clientId) {
    console.log("Client Id is null");
    layoutClientHandler.clientId = crypto.randomUUID();
  }

  await event.fetch('/api/client/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: layoutClientHandler.clientId })
  });


  if (token === null) { 
    // Set session cookie
    const token = generateSessionToken();
    const session = await createSession(token, layoutClientHandler.clientId);
    setSessionTokenCookie(event, token, session.expiresAt);
    return new Response(null, {
      status: 401
    });
  }

  const { session, user } = await validateSessionToken(token);
  if (session === null) {
    deleteSessionTokenCookie(event);
    return new Response(null, {
      status: 401
    });
  }
  setSessionTokenCookie(event, token, session.expiresAt);
}) satisfies PageServerLoad;