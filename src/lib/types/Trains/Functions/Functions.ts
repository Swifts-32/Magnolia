
export type TrainFunctionModes = "toggle" | "select";
export type TrainFunctionIcons = "Speaker" | "Light1" | "Light2" | "Bell" | "Text";
export type TrainFunctionUUID = `${string}-${string}-${string}-${string}-${string}`;

export interface ITrainFunctionData {
	uuid: TrainFunctionUUID;
	value: string;
	name: string;
	icon: TrainFunctionIcons;
	mode: TrainFunctionModes;
	visible: boolean;
}

export function isFunctionData(obj: unknown): obj is ITrainFunctionData {
	return obj instanceof Object && "uuid" in obj && "value" in obj && "name" in obj && "icon" in obj && "mode" in obj && "visible" in obj;
}