import type { ClientInit } from "@sveltejs/kit";
// import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler.svelte";

export const init: ClientInit = async () => {
  // layoutClientHandler.loadLayouts();

  // window.addEventListener("beforeunload", (event) => {
  //   console.log("Unloading");

  //   fetch('/api/client/delete', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ clientId: layoutClientHandler.clientId })
  //   });
  // });
}

// src/hooks.client.ts
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
