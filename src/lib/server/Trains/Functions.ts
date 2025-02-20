
export type TrainFunctionModes = "toggle" | "select";

export enum TrainFunctionIcons {
    "Speaker" = 0,
    "Light1" = 1,
    "Light2" = 2,
    "Bell" = 3,
    "Text" = 4
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
