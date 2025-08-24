import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {

  return {
    sessionId: locals.sessionId
  };

}) satisfies PageServerLoad;