import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { isFunctionData, type ITrainFunctionData } from "./Functions/Functions";

export type TrainUUID = `${string}-${string}-${string}-${string}-${string}`;
export type TrainAddress = string | number;

export interface ITrainData {
    uuid: TrainUUID;
    connUUID: ConnectionUUID;
    layoutUUID: LayoutUUID;
    name: string;
    address: TrainAddress;
    functions: ITrainFunctionData[];
}

export function isTrainData(obj: unknown): obj is ITrainData {
    return obj instanceof Object && "uuid" in obj && "connUUID" in obj && "name" in obj && "address" in obj && "functions" in obj  && "layoutUUID" in obj;
}
