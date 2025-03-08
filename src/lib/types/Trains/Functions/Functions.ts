import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { TrainUUID } from "../Train";

export const TrainFunctionModesList = ["Toggle", "Select"] as const;
export type TrainFunctionModes = typeof TrainFunctionModesList[number];

export const TrainFunctionIconsList = ["Speaker", "Light1", "Light2", "Bell", "Text"] as const;
export type TrainFunctionIcons = typeof TrainFunctionIconsList[number];

export interface ITrainFunctionData {
	value: string;
	position: number;
	name: string;
	icon: TrainFunctionIcons;
	mode: TrainFunctionModes;
	visible: boolean;
	trainUUID: TrainUUID;
	connUUID: ConnectionUUID;
	layoutUUID: LayoutUUID;
}

export function isFunctionData(obj: unknown): obj is ITrainFunctionData {
	return obj instanceof Object && "value" in obj && "name" in obj && "icon" in obj && "mode" in obj && "visible" in obj && "position" in obj && "trainUUID" in obj && "connUUID" in obj && "layoutUUID" in obj;
}