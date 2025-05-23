import type { ClientInit } from "@sveltejs/kit";
import { layoutClientHandler } from "./services/Layouts/LayoutClientHandler.svelte";

export const init: ClientInit = async () => {
  layoutClientHandler.loadLayouts();
  layoutClientHandler.connectToSse();

  layoutClientHandler.clientId = crypto.randomUUID();

  await fetch('/api/client/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: layoutClientHandler.clientId })
  });

  window.addEventListener("beforeunload", (event) => {
    console.log("Unloading");

    fetch('/api/client/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: layoutClientHandler.clientId })
    });

    fetch("/api/layout/save");
  });
}