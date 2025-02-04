import type { ConnectionProtocols } from "$lib/client/Protocols/protocols";
import type { EmulatorConnection } from "./Emulator/Emulator.server";
import type { SerialConnection } from "./Serial/SerialConnection.server";

export interface IConnection {
    connect: () => void,
    isConnected: boolean,
    protocol: ConnectionProtocols,
    connName: string,
    disconnect: () => void,
    write: (data: string) => void,
    onDataReceived: (callback: (data: string) => void) => void,
}

export type ConnectionType = SerialConnection | EmulatorConnection;