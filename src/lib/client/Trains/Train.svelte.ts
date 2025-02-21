import type { TrainFunctionIcons, TrainFunctionModes, TrainFunctionUUID } from "$lib/types/Trains/Functions/Functions";
import type { TrainAddress } from "$lib/types/Trains/Train";

import type { TrainUUID } from "$lib/types/Trains/Train";
import type { ConnectionUUID } from "../LayoutClient.svelte";
import { TrainClientFunction } from "./Functions/Function.svelte";

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

    public addFunction(uuid: TrainFunctionUUID, value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes) {
        this.functions.set(uuid, new TrainClientFunction(uuid, value, name, icon, mode));
    }
}


