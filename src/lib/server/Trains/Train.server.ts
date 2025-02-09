import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import type { FunctionIcons, FunctionModes } from "../../../services/train.svelte";
import { ServerTrainFunctions } from "./Functions.server";

export type TrainUUID = `${string}-${string}-${string}-${string}-${string}`;
export type TrainAddress = string | number;

export class ServerTrain {
    public uuid: TrainUUID;
    public connUUID: ConnectionUUID;
    public address: TrainAddress;
    public name: string;
    public functions: Map<number, ServerTrainFunctions> = new Map();

    constructor(address: TrainAddress, name: string, connUUID: ConnectionUUID, uuid: TrainUUID | undefined = undefined) {
        this.address = address;
        this.name = name;
        this.uuid = uuid ?? crypto.randomUUID();
        this.connUUID = connUUID;
    }
    
    toJSON() {
        return {
            uuid: this.uuid,
            connUUID: this.connUUID,
            address: this.address,
            name: this.name,
            functions: Array.from(this.functions.entries()).map(([id, funct]) => funct.toJSON()),
        };
    }

    public static fromJSON(json: any): ServerTrain | null {
        if (json.uuid == undefined || json.connUUID == undefined || json.address == undefined || json.name == undefined) {
            console.log(`Invalid train data`);
            return null;
        }

        // TODO: Recreate functions when loading trains

        return new ServerTrain(json.address, json.name, json.connUUID, json.uuid);
    }

    
    addFunction(id: number, icon: FunctionIcons, mode: FunctionModes) {
        this.functions.set(id, new ServerTrainFunctions(id, icon, mode));
    }
}