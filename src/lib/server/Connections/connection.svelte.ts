import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import type { ConnectionProtocols } from "$lib/client/Protocols/protocols";
import type { HardwareTypes } from "./Hardware/hardware";

export class Connection {
    public name: string;
    public protocol: ConnectionProtocols;
    public uuid: ConnectionUUID;
    public hardware: HardwareTypes;

    constructor(connection: HardwareTypes, name: string, protocol: ConnectionProtocols, uuid: ConnectionUUID) {
        this.hardware = connection;
        this.name = name;
        this.protocol = protocol;
        this.uuid = uuid;
    }

    toJSON() {
        return {
            name: this.name,
            protocol: this.protocol,
            uuid: this.uuid,
            hardware: this.hardware.toJSON(),
        };
    }

    async connect(): Promise<string> {
        return await this.hardware.connect();
    }

    async disconnect(): Promise<string> {
        return await this.hardware.disconnect();
    }


    write(data: string) {
        this.hardware.write(data);
    }

}

