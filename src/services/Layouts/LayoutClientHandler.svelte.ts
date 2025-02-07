import { LayoutClient, type LayoutUUID } from "$lib/client/LayoutClient.svelte";

class LayoutClientHandler {
    public layouts: Map<LayoutUUID, LayoutClient> = $state(new Map());

    public async refreshLayouts() {
        const json = await fetch("/api/layout").then(res => res.json());
        const layouts = json.map(([uuid, config]: [LayoutUUID, any]) => ({ uuid, config }));


        for (const layout of layouts) {
            if (!this.layouts.has(layout.uuid)) {
                // Layout does not exist, create it
                const layoutClient = await LayoutClient.create(layout.uuid, fetch);
                this.layouts.set(layout.uuid, layoutClient);
            } else if (this.layouts.has(layout.uuid)) {
                // Layout exists, update it
                const layoutClient = this.layouts.get(layout.uuid);
                // Add in an update function
            }
            else {
                this.layouts.delete(layout.uuid);
            }

        }
    }
}


export const layoutClientHandler = new LayoutClientHandler();