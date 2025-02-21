import type { TrainFunctionIcons, TrainFunctionModes, TrainFunctionUUID } from "$lib/types/Trains/Functions/Functions";

export class TrainClientFunction {
    uuid: TrainFunctionUUID;
    value: string; // E.g. 1 for F1 or 1123.2434.35 LCC.
    name: string; // User friendly display name

    icon: TrainFunctionIcons;
    mode: TrainFunctionModes;
    visible: boolean = true;

    state: boolean = $state(false);

    constructor(uuid: TrainFunctionUUID, value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes) {
        this.uuid = uuid;
        this.value = value;
        this.name = name;

        this.mode = mode;
        this.icon = icon;
    }

    toJSON() {
        return {
            uuid: this.uuid,
            value: this.value,
            name: this.name,

            icon: this.icon,
            mode: this.mode,
            visible: this.visible,
        };
    }
}