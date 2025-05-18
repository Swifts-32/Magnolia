import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SvelteMap } from "svelte/reactivity";

class LayoutClientHandler {
  private appEventSource: EventSource | null = null;
  public layouts: SvelteMap<LayoutUUID, LayoutClient> = new SvelteMap();

  public async loadLayouts() {
    const layoutHandlerJson = await fetch("/api/layout").then(res => res.json());
    const layoutServerUuids = new Set();

    for (const layoutJson of layoutHandlerJson.layouts) {
      const layout = LayoutClient.fromJsonWeb(layoutJson);
      if (!layout) continue;

      layoutServerUuids.add(layoutJson.uuid);

      this.layouts.set(layout.uuid, layout);
    }

    // Remove layouts that no longer exist on server
    for (const uuid of this.layouts.keys()) {
      if (!layoutServerUuids.has(uuid)) {
        this.layouts.delete(uuid);
      }
    }
  }

  public connectToSse() {
    this.appEventSource = new EventSource(`/api/stream`);

    this.appEventSource.addEventListener("Update", (event) => {
      const message = event.data.trim();

      if (message === "Layouts") {
        this.loadLayouts();
        return;
      }
    });

    this.appEventSource.addEventListener("UpdateLayoutConnections", (event) => {
      const message = event.data.trim().match(/^LayoutUuid:([^:]+):(.+)/);

      const layoutUuid = message[1] as LayoutUUID;
      const layout = this.layouts.get(layoutUuid);
      if (!layout) return;

      const data = message[2];
      if (!data) return;

      try {
        layout.loadConnectionsFromJson(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    });

    this.appEventSource.addEventListener("UpdateLayoutSensors", (event) => {
      const message = event.data.trim().match(/^LayoutUuid:([^:]+):(.+)/);

      const layoutUuid = message[1] as LayoutUUID;
      const layout = this.layouts.get(layoutUuid);
      if (!layout) return;

      const data = message[2];
      if (!data) return;

      try {
        layout.loadSensorsFromJson(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    });

    this.appEventSource.onerror = (event) => {
      console.error("EventSource failed:", event);
      this.appEventSource?.close();
      this.appEventSource = null;
    };
  }
}

export const layoutClientHandler = new LayoutClientHandler();