import type { ConnectionType } from "$lib/client/Connections/Protocols/protocols";

export interface HardwareClass {
    connect: () => Promise<boolean>;
    isConnected: boolean;
    connType: ConnectionType;
    disconnect: () => Promise<boolean>;
    write: (data: Buffer) => void;
    onDataReceived: (callback: (data: Buffer) => void) => void;
}

export interface ISerialConnection extends HardwareClass {
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends HardwareClass {
};