// export const load: PageServerLoad = (async (event) => {

//   // if (event.locals.user) {
//   //   return redirect(303, "/");
//   // };

//   // if (!layoutClientHandler.clientId) {
//   //   layoutClientHandler.clientId = crypto.randomUUID();
//   // }

//   // await event.fetch('/api/client/add', {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   body: JSON.stringify({ clientId: layoutClientHandler.clientId })
//   // });

//   // const cookie = event.cookies.get("session") ?? null;
//   // if (cookie) {
//   //   const { session, user } = await validateSessionToken(cookie);

//   //   if (session && user) {
//   //     return redirect(303, "/");
//   //   }
//   // }

//   // deleteSessionTokenCookie(event);

//   // const token = generateSessionToken();
//   // const session = await createSession(token, layoutClientHandler.clientId);
//   // setSessionTokenCookie(event, token, session.expiresAt);

//   // if (event.locals.user) {
//   //   console.log("Authenticated");
//   //   return redirect(303, "/");
//   // }
// }) satisfies PageServerLoad;