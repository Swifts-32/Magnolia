import type { ConnectionTypes } from "$lib/client/Protocols/protocols";
import type { EmulatorConnection } from "./Emulator/Emulator.server";
import type { SerialConnection } from "./Serial/SerialConnection.server";
import type { ServerSideEventsConnection } from "./ServerSideEvents/ServerSideEvents.server";

export interface IHardware {
    connect: () => Promise<string>;
    isConnected: boolean;
    connType: ConnectionTypes;
    disconnect: () => Promise<string>;
    write: (data: string) => void;
    onDataReceived: (callback: (data: string) => void) => void;
}

export interface ISerialConnection extends IHardware {
    connType: ConnectionTypes.Serial;
    path: string;
    baudRate: number;
    toJSON: () => { connType: ConnectionTypes.Serial, path: string, baudRate: number };
}

export interface IEmulatorConnection extends IHardware {
    connType: ConnectionTypes.Emulator;
    toJSON: () => { connType: ConnectionTypes.Emulator };
};

export interface IServerSideEventsConnection extends IHardware {
    connType: ConnectionTypes.SSE;
    toJSON: () => { connType: ConnectionTypes.SSE };
}


export type HardwareTypes = SerialConnection | EmulatorConnection | ServerSideEventsConnection;
