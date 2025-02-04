import { ConnectionProtocols } from '$lib/client/Protocols/protocols';
import { Layout } from '../Layout.server.svelte';


class LayoutServerHandlerClass {
    public layouts: Map<string, Layout> = new Map();

    //TODO Remove adding default layout
    constructor() {

        this.addNewLayout("L1");
        this.addNewLayout("L2");

        let layout = this.layouts.get("L1");
        if (!layout) {
            console.log("Layout L1 not found");
            return;
        }



        layout.createDccEmulatorConnection(ConnectionProtocols.DCCEX, "Emulator 1");
        layout.createDccEmulatorConnection(ConnectionProtocols.DCCEX, "Emulator 2");
        layout.createDccEmulatorConnection(ConnectionProtocols.DCCEX, "Emulator 3");
        console.log("Created Layout L1");

        // layout.createDccSerialConnection(ConnectionProtocols.DCCEX, "COM4", 115200);

    }


    addNewLayout(name: string) {
        this.layouts.set(name, new Layout(name));
    }


}

export const LayoutServerHandler = new LayoutServerHandlerClass();