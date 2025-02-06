import { ConnectionProtocols } from '$lib/client/Protocols/protocols';
import { Layout } from './Layout.server.svelte';


class LayoutServerHandlerClass {
    public layouts: Map<string, Layout> = new Map();

    constructor() {
        //TODO Remove adding default layout
        this.createDefaultLayout("L1", 3);
        this.createDefaultLayout("L2", 2);
    }    

    private createDefaultLayout(name: string, noOfConnections: number) {
        let layout = this.addNewLayout(name);
        for (let i = 0; i < noOfConnections; i++) {
            layout.createDccEmulatorConnection(ConnectionProtocols.DCCEX, `Emulator ${i + 1}`);
        }

        console.log(`Created Default Layout ${name}`);
    }

    addNewLayout(name: string): Layout {
        let layout = new Layout(name);
        this.layouts.set(name, layout);
        return layout;
    }
}

export const LayoutServerHandler = new LayoutServerHandlerClass();