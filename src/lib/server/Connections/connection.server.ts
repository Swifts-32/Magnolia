import type { ConnectionProtocols } from "$lib/client/Protocols/protocols";
import type { HardwareTypes } from "./Hardware/hardware";

export class Connection {
    public hardware: HardwareTypes;
    public name: string;
    public protocol: ConnectionProtocols;


    constructor(connection: HardwareTypes, name: string, protocol: ConnectionProtocols) {
        this.hardware = connection;
        this.name = name;
        this.protocol = protocol;
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
