import { Layout } from '../Layout.server.svelte';


class LayoutHandlerClass {
    Layouts: Map<string, Layout> = new Map();


    addNewLayout(name: string) {
        this.Layouts.set(name, new Layout(name));
    }

}

export const LayoutServerHandler = new LayoutHandlerClass();