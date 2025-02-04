import type { LayoutClient } from "$lib/LayoutClient.svelte";

class LayoutClientHandler {
    public layouts = new Map<string, LayoutClient>();


    addLayouts(layouts: Map<string, LayoutClient>) {
        layouts.forEach(element => {
            this.layouts.set(element.name, element);
        });
    }
}

export const layoutClientHandler = new LayoutClientHandler();