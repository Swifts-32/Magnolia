import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { TrainUUID } from "$lib/types/Trains/Train";
import type { TrainFunctionIcons, TrainFunctionModes, ITrainFunctionData } from "../../types/Trains/Functions/Functions";

export class ServerTrainFunctions {
    value: string; // E.g. 1 for F1 or 1123.2434.35 LCC.
    name: string; // User friendly display name    
    icon: TrainFunctionIcons;
    mode: TrainFunctionModes;
    visible: boolean = true;
    position: number;

    trainUUID: TrainUUID;
    connUUID: ConnectionUUID;
    layoutUUID: LayoutUUID;

    constructor(value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes, position: number, trainUUID: TrainUUID, connUUID: ConnectionUUID, layoutUUID: LayoutUUID) {
        this.value = value;
        this.name = name;

        this.mode = mode;
        this.icon = icon;
        this.position = position;

        this.trainUUID = trainUUID;
        this.connUUID = connUUID;
        this.layoutUUID = layoutUUID;
    }


    toJSON(): ITrainFunctionData {
        return {
            value: this.value,
            name: this.name,

            icon: this.icon,
            mode: this.mode,
            visible: this.visible,
            position: this.position,

            trainUUID: this.trainUUID,
            connUUID: this.connUUID,
            layoutUUID: this.layoutUUID,
        };
    }
}

