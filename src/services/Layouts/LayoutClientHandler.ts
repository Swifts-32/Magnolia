import type { LayoutClient, LayoutUUID } from "$lib/LayoutClient.svelte";

class LayoutClientHandler {
    private layouts = new Map<string, LayoutClient>();


    addLayouts(layouts: Map<string, LayoutClient>) {
        layouts.forEach(element => {
            this.layouts.set(element.name, element);
        });
    }

    addLayout(layout: LayoutClient) {
        this.layouts.set(layout.name, layout);
    }

    getLayout(layoutUUID: LayoutUUID) {
        return this.layouts.get(layoutUUID);
    }

    getLayouts(): LayoutClient[] {
        return Array.from(this.layouts.values());
    }

}


export const layoutClientHandler = new LayoutClientHandler();