import type { ConnectionTypes } from "$lib/client/Protocols/protocols";
import type { EmulatorConnection } from "./Emulator/Emulator.server";
import type { SerialConnection } from "./Serial/SerialConnection.server";


export interface IHardware {
    connect: () => void;
    isConnected: boolean;
    connType: ConnectionTypes;
    disconnect: () => void;
    write: (data: string) => void;
    onDataReceived: (callback: (data: string) => void) => void;
}

export interface ISerialConnection extends IHardware {
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends IHardware {
}

export type HardwareTypes = SerialConnection | EmulatorConnection;
