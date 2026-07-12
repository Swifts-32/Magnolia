import type { ConnectionType } from "$lib/types/Hardware";

export interface IHardware {
    connType: ConnectionType;

    isConnected: boolean;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<boolean>;

    onDataReceived: (callback: (data: Buffer) => void) => void;
    write: (data: Buffer) => void;
}

export interface ISerialConnection extends IHardware {
    path: string;
    baudRate: number;
}

export interface IEmulatorConnection extends IHardware { }