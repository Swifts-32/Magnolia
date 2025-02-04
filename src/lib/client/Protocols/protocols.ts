import type { ConnectionUUID } from "$lib/LayoutClient.svelte";
import type { Direction } from "../../../routes/(app)/layouts/[id]/throttle/throttle";
import type { Train } from "../../../services/train.svelte";

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

export interface IProtocol {
    isConnected: boolean;
    connName: string;
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