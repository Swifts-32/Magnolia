import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SvelteMap } from "svelte/reactivity";

class LayoutClientHandler {
  private appEventSource: EventSource | null = null;
  public layouts: SvelteMap<LayoutUUID, LayoutClient> = new SvelteMap();

  public async loadLayouts() {
    const layoutHandlerJson = await fetch("/api/layout").then(res => res.json());

    const layoutServerUuids = new Set();

    for (const layoutJson of layoutHandlerJson.layouts) {
      if (layoutJson.uuid === undefined) {
        console.log("Invalid layout uuid");
        return;
      }
      else if (layoutJson.name === undefined) {
        console.log("Invalid layout name");
        return;
      }

      layoutServerUuids.add(layoutJson.uuid);

      const layoutClient = new LayoutClient(layoutJson.name, layoutJson.uuid);

      // Recreate connections
      layoutClient.loadConnectionsFromJson(layoutJson);

      // TODO recreate sensors
      layoutClient.loadSensorsFromJson(layoutJson);

      this.layouts.set(layoutClient.uuid, layoutClient);
    }

    // Remove layouts that don't exist on server
    for (const uuid of this.layouts.keys()) {
      if (!layoutServerUuids.has(uuid)) {
        this.layouts.delete(uuid);
        console.log(`Layout ${uuid} removed from client`);
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
    
    this.appEventSource.addEventListener("LayoutConnectionDataReceived", (event) => {
      const message = event.data.trim().match(/^LayoutUuid:([^:]+):ConnectionUuid:([^:]+):(.+)/);
      
      const layoutUuid = message[1] as LayoutUUID;
      const layout = this.layouts.get(layoutUuid);
      if (!layout) return;

      const connectionUuid = message[2];
      const connection = layout.connections.get(connectionUuid);
      if (!connection) return;
  
      const data = message[3];
      if (!data) return;
  
      try {
        connection.processCommand(JSON.parse(data));
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