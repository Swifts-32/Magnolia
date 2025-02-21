import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";

class LayoutClientHandler {
    public layouts: Map<LayoutUUID, LayoutClient> = $state(new Map());

    public async refreshLayouts() {
        const json = await fetch("/api/layout").then(res => res.json());
        const layouts = json.map((layout: { uuid: LayoutUUID, name: string, position: number, connections: any[] }) => ({
            uuid: layout.uuid,
            name: layout.name,
            position: layout.position,
        }));
        // Get set of server layout UUIDs
        const serverLayoutUUIDs = new Set(layouts.map((layout: { uuid: LayoutUUID }) => layout.uuid));

        // Remove layouts that don't exist on server
        for (const uuid of this.layouts.keys()) {
            if (!serverLayoutUUIDs.has(uuid)) {
                this.layouts.delete(uuid);
                console.log(`Layout ${uuid} removed from client`);
            }
        }

        for (const layout of layouts) {
            if (!this.layouts.has(layout.uuid)) {
                // Layout does not exist, create it
                const layoutClient = await LayoutClient.create(layout.uuid, fetch);
                this.layouts.set(layout.uuid, layoutClient);

                console.log(`Layout ${layout.uuid} added to client`);
            } else {
                // Layout exists, update it
                let layoutClient = this.layouts.get(layout.uuid);
                if (!layoutClient) {
                    console.log(`Layout client not found for layout ${layout.uuid}`);
                    continue;
                }

                layoutClient.name = layout.name;
                await layoutClient.refreshLayout();

                console.log(`Layout ${layout.uuid} updated on client`);
            }
        }

        // Trigger reactivity by reassigning the map
        this.layouts = new Map(this.layouts);
    }
}

export const layoutClientHandler = new LayoutClientHandler();