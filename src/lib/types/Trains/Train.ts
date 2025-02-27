import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import type { ITrainFunctionData } from "./Functions/Functions";

export type TrainUUID = `${string}-${string}-${string}-${string}-${string}`;
export type TrainAddress = string | number;

export interface ITrainData {
    uuid: TrainUUID;
    connUUID: ConnectionUUID;
    name: string;
    address: TrainAddress;
    functions: ITrainFunctionData[];
}

export function isTrainData(obj: unknown): obj is ITrainData {
    return obj instanceof Object && "uuid" in obj && "connUUID" in obj && "name" in obj && "address" in obj && "functions" in obj;
}
