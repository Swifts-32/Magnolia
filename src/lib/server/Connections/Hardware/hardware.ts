import type { ConnectionType } from "$lib/client/Protocols/protocols";

export interface HardwareClass {
    connect: () => Promise<string>;
    isConnected: boolean;
    connType: ConnectionType;
    disconnect: () => Promise<string>;
    write: (data: string) => void;
    onDataReceived: (callback: (data: string) => void) => void;
    toJson: () => string;
}

export interface ISerialConnection extends HardwareClass {
    connType: ConnectionType.Serial;
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends HardwareClass {
    connType: ConnectionType.Emulator;
};