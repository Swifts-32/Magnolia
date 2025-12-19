import type { ConnectionType } from "$lib/client/Protocols/protocols";

export interface HardwareClass {
    connect: () => Promise<boolean>;
    isConnected: boolean;
    connType: ConnectionType;
    disconnect: () => Promise<boolean>;
    write: (data: string) => void;
    onDataReceived: (callback: (data: string) => void) => void;
}

export interface ISerialConnection extends HardwareClass {
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends HardwareClass {
};