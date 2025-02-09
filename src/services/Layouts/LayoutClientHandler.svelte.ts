import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";

class LayoutClientHandler {
    public layouts: Map<LayoutUUID, LayoutClient> = $state(new Map());

    public async refreshLayouts() {
        const json = await fetch("/api/layout").then(res => res.json());
        const layouts = json.map(([uuid, config]: [LayoutUUID, any]) => ({ uuid, config }));
        // Get set of server layout UUIDs
        const serverLayoutUUIDs = new Set(layouts.map((layout: { uuid: LayoutUUID }) => layout.uuid));

        // Remove layouts that don't exist on server
        for (const uuid of this.layouts.keys()) {
            if (!serverLayoutUUIDs.has(uuid)) {
                this.layouts.delete(uuid);
            }
        }


        for (const layout of layouts) {
            if (!this.layouts.has(layout.uuid)) {
                // Layout does not exist, create it
                const layoutClient = await LayoutClient.create(layout.uuid, fetch);
                this.layouts.set(layout.uuid, layoutClient);
            } else {
                // Layout exists, update it
                let layoutClient = this.layouts.get(layout.uuid);
                if (!layoutClient) {
                    console.log(`Layout client not found for layout ${layout.uuid}`);
                    continue;
                }

                await layoutClient.refreshLayout();
            }
        }
    }

}



export const layoutClientHandler = new LayoutClientHandler();