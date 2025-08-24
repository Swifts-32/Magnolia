import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { z } from "zod/v4";
import { type ITrainFunctionData } from "./Functions/Functions";

export type TrainUuid = `${string}-${string}-${string}-${string}-${string}`;
export type TrainAddress = string; // e.g.Dcc - 120 or LCC - 12.334.62.8

export const TrainDirectionsList = ["Forward", "Reverse", "Unknown"] as const;
export const TrainDirection = z.enum(TrainDirectionsList);
export type TrainDirection = z.infer<typeof TrainDirection>;

export interface ITrainData {
    uuid: TrainUuid;
    connUUID: ConnectionUUID;
    layoutUUID: LayoutUUID;
    name: string;
    address: TrainAddress;
    functions: ITrainFunctionData[];
}

export function isTrainData(obj: unknown): obj is ITrainData {
    return obj instanceof Object && "uuid" in obj && "connUUID" in obj && "name" in obj && "address" in obj && "functions" in obj && "layoutUUID" in obj;
}
