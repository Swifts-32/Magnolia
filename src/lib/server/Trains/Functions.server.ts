
export type TrainFunctionModes = "toggle" | "select"

export enum TrainFunctionIcons {
    "Speaker" = 0,
    "Light1" = 1,
    "Light2" = 2,
    "Bell" = 3,
    "Text" = 4,
}

export type TrainFunctionUUID = `${string}-${string}-${string}-${string}-${string}`;

export interface TrainFunctionJSON {
    uuid: TrainFunctionUUID;
    value: string;
    name: string;
    icon: TrainFunctionIcons;
    mode: TrainFunctionModes;
    visible: boolean;
}

export class ServerTrainFunctions {
    uuid: TrainFunctionUUID;
    value: string; // E.g. 1 for F1 or 1123.2434.35 LCC.
    name: string; // User friendly display name    
    icon: TrainFunctionIcons;
    mode: TrainFunctionModes;
    visible: boolean = true;

    constructor(uuid: TrainFunctionUUID, value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes) {
        this.uuid = uuid;
        this.value = value;
        this.name = name;

        this.mode = mode;
        this.icon = icon;
    }


    toJSON(): TrainFunctionJSON {
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

