import type { ITrainFunctionData, TrainFunctionIcons, TrainFunctionModes } from "$lib/types/Trains/Functions/Functions";

export class TrainClientFunction {
    value: string; // E.g. 1 for F1 or 1123.2434.35 LCC.
    name: string; // User friendly display name

    icon: TrainFunctionIcons;
    mode: TrainFunctionModes;
    visible: boolean = true;
    position: number;

    state: boolean = $state(false);

    constructor(value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes, position: number) {
        this.value = value;
        this.name = name;

        this.mode = mode;
        this.icon = icon;
        this.position = position;
    }

    toJSON(): ITrainFunctionData {
        return {
            value: this.value,
            name: this.name,

            icon: this.icon,
            mode: this.mode,
            visible: this.visible,
            position: this.position,
        };
    }
}