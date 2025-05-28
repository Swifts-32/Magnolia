import type { ClientInit } from "@sveltejs/kit";
import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler.svelte";

export const init: ClientInit = async () => {
  // layoutClientHandler.loadLayouts();

  window.addEventListener("beforeunload", (event) => {
    console.log("Unloading");

    fetch('/api/client/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: layoutClientHandler.clientId })
    });
  });
}