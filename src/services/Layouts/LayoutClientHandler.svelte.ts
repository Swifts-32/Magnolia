import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SvelteMap } from "svelte/reactivity";

class LayoutClientHandler {
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
}

export const layoutClientHandler = new LayoutClientHandler();