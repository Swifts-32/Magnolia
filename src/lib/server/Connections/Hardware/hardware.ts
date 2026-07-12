import type { ConnectionType } from "$lib/client/Connections/Protocols/protocols";

export interface HardwareClass {
    connType: ConnectionType;

    isConnected: boolean;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<boolean>;

    onDataReceived: (callback: (data: Buffer) => void) => void;
    write: (data: Buffer) => void;
}

export interface ISerialConnection extends HardwareClass {
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends HardwareClass { }