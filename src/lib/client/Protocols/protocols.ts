import type { ConnectionUUID } from "$lib/LayoutClient.svelte";
import type { Direction } from "../../../routes/(app)/layouts/[id]/throttle/throttle";
import type { Train } from "../../../services/train.svelte";
import type { DccEx } from "./DccEx/DccEx.svelte";

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
    layoutUUID: string;
    connUUID: ConnectionUUID;
    powerStatus: boolean;
    protocol: ConnectionProtocols;
    trains: Map<number, Train>;
    version: string | undefined;

    processCommand(command: string): void;
    setDirection(cab: number | undefined, dir: Direction): void;
    getDirection(cab: number | undefined): Direction | undefined;
    setSpeed(cab: number | undefined, speed: number): void;
    setFunction(cab: number | undefined, func: number, state: boolean): void;
    getTrain(cab: number | undefined): Train | undefined;
    addTrain(cab: number, name: string): void;

}