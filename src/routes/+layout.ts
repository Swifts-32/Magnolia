import { browser } from "$app/env";
import { getOrCreateTabSession } from '#lib/client/Auth/session.js';

export const load = async ({ fetch: orginalfetch }) => {
  if (browser) {
    const sessionId = getOrCreateTabSession();

    // patch fetch globally
    const originalFetch = window.fetch;
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      init = init || {};
      init.headers = { ...init.headers || {}, "x-session-id": sessionId };

      return originalFetch(input, init);
    }) as typeof window.fetch;

    // // Register the session with the server
    // await fetch("/api/session", {
    //   method: "POST",
    //   headers: { "x-session-id": sessionId }
    // });

    return { sessionId };
  }

  // On SSR (before hydration), no sessionId yet
  return { sessionId: null };
};
