import type { TrainFunctionUUID } from "$lib/server/Trains/Functions";
import type { TrainAddress } from "$lib/server/Trains/Train.server";

import type { TrainUUID } from "$lib/server/Trains/Train.server";
import type { ConnectionUUID } from "../LayoutClient.svelte";
import type { TrainClientFunction } from "./Functions/Function.svelte";

export enum TrainDirection {
    Reverse = 0,
    Forward = 1,
}

export class ClientTrain {
    // Train data
    public uuid: TrainUUID;
    public address: TrainAddress = $state() as TrainAddress;
    public name: string = $state() as string;
    public connUUID: ConnectionUUID = $state() as ConnectionUUID;
    public functions: Map<TrainFunctionUUID, TrainClientFunction> = new Map();

    // Non-Saveable Data
    public speed: number = $state(0);
    public direction: TrainDirection = $state(TrainDirection.Forward);


    constructor(uuid: TrainUUID, address: TrainAddress, name: string, connUUID: ConnectionUUID) {
        this.uuid = uuid;
        this.address = address;
        this.name = name;
        this.connUUID = connUUID;
    }

    public addFunctions(functions: TrainClientFunction[]) {
        functions.forEach((func) => {
            this.functions.set(func.uuid, func);
        });
    }
}


