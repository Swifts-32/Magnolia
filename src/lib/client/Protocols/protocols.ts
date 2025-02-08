import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { Train } from "../../../services/train.svelte";
import type { ClientTrain, TrainDirection } from "../Trains/Train.svelte";

export enum ConnectionTypes {
    Serial = 0,
    Wifi = 1,
    Bluetooth = 3,
    Zigbee = 4,
    Emulator = 5,
}

export enum ConnectionProtocols {
    DCCEX = 0,
    LCC = 1,
}


export function getProtocolName(protocol: ConnectionProtocols): string {
    switch (protocol) {
        case ConnectionProtocols.DCCEX:
            return "DCC EX";
        case ConnectionProtocols.LCC:
            return "LCC";
        default:
            return "Unknown";
    }
}

export function getConnectionTypeName(connType: ConnectionTypes): string {
    switch (connType) {
        case ConnectionTypes.Serial:
            return "Serial";

        case ConnectionTypes.Wifi:
            return "Wifi";
        case ConnectionTypes.Bluetooth:
            return "Bluetooth";
        case ConnectionTypes.Zigbee:
            return "Zigbee";
        case ConnectionTypes.Emulator:
            return "Emulator";
        default:
            return "Unknown";

    }
}



export interface IProtocol {
    isConnected: boolean;

    connName: string;
    connType: ConnectionTypes;
    layoutUUID: LayoutUUID;
    connUUID: ConnectionUUID;
    powerStatus: boolean;
    protocol: ConnectionProtocols;
    version: string | undefined;

    processCommand(command: string): void;
    setDirection(train: ClientTrain): void;
    setSpeed(train: ClientTrain): void;
}