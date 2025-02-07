import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import type { ConnectionProtocols } from "$lib/client/Protocols/protocols";
import type { Train } from "../../../services/train.svelte";
import type { ServerTrain } from "../Trains/Train.server";
import type { HardwareTypes } from "./Hardware/hardware";

export class Connection {
    public hardware: HardwareTypes;
    public name: string;
    public protocol: ConnectionProtocols;
    public uuid: ConnectionUUID;
    public trains: Map<number, ServerTrain> = new Map();


    constructor(connection: HardwareTypes, name: string, protocol: ConnectionProtocols, uuid: ConnectionUUID) {
        this.hardware = connection;
        this.name = name;
        this.protocol = protocol;
        this.uuid = uuid;
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

    toJSON() {
        return {
            name: this.name,
            protocol: this.protocol,
            uuid: this.uuid,
            hardware: this.hardware.toJSON(),
            trains: Array.from(this.trains.values()).map(train => train.toJSON()),
        };
    }
}

