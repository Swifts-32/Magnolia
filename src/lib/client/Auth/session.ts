export function getOrCreateTabSession() {
  let sessionId = sessionStorage.getItem("tabSessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("tabSessionId", sessionId);
  }

  return sessionId;
}