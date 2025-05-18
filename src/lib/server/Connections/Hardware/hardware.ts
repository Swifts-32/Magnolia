import type { ConnectionTypes } from "$lib/client/Protocols/protocols";

export interface HardwareClass {
    connect: () => Promise<string>;
    isConnected: boolean;
    connType: ConnectionTypes;
    disconnect: () => Promise<string>;
    write: (data: string) => void;
    onDataReceived: (callback: (data: string) => void) => void;
    toJson: () => string;
}

export interface ISerialConnection extends HardwareClass {
    connType: ConnectionTypes.Serial;
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends HardwareClass {
    connType: ConnectionTypes.Emulator;
};