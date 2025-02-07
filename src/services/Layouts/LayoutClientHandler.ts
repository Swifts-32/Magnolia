import type { LayoutClient, LayoutUUID } from "$lib/client/LayoutClient.svelte";

class LayoutClientHandler {
    private layouts = new Map<LayoutUUID, LayoutClient>();


    addLayouts(layouts: Map<LayoutUUID, LayoutClient>) {
        layouts.forEach((element) => {
            this.layouts.set(element.uuid, element);
        });
    }


    addLayout(layout: LayoutClient) {
        this.layouts.set(layout.uuid, layout);
    }


    getLayout(layoutUUID: LayoutUUID) {
        return this.layouts.get(layoutUUID);
    }

    getLayouts(): LayoutClient[] {
        return Array.from(this.layouts.values());
    }

}


export const layoutClientHandler = new LayoutClientHandler();