import type { Handle, HandleServerError } from "@sveltejs/kit/hooks";
import type { ValidationError } from "@sveltejs/kit";

if (typeof crypto !== "undefined" && !crypto.randomUUID) {
  crypto.randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;

      return v.toString(16);
    }) as `${string}-${string}-${string}-${string}-${string}`;
} else {
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

export const handleError: HandleServerError = ({ error, event, kind }) => {
  console.error("Detailed Server Error:", error);

  if (kind === "validation") {
    return {
      message: `Validation error occurred`,
    };
  }

  return {
    message: "A mistake happened",
  };
};
