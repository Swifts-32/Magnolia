import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import { ServerTrainFunctions } from "./Functions.server";
import { TrainFunctionIcons, type TrainFunctionModes, type TrainFunctionUUID } from "../../types/Trains/Functions/Functions";

export type TrainUUID = `${string}-${string}-${string}-${string}-${string}`;
export type TrainAddress = string | number;

export class ServerTrain {
    public uuid: TrainUUID;
    public connUUID: ConnectionUUID;
    public address: TrainAddress;
    public name: string;
    public functions: Map<TrainFunctionUUID, ServerTrainFunctions> = new Map();

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
            functions: Array.from(this.functions.values()).map(funct => funct.toJSON()),
        };
    }

    public static fromJSON(json: any): ServerTrain | null {
        if (json.uuid == undefined || json.connUUID == undefined || json.address == undefined || json.name == undefined) {
            console.log(`Invalid train data`);
            return null;
        }

        let serverTrain = new ServerTrain(json.address, json.name, json.connUUID, json.uuid);

        // TODO: Recreate functions when loading trains
        const jsonFunctions = json.functions;

        for (const funct of jsonFunctions) {
            if (funct.uuid == undefined || funct.value == undefined || funct.name == undefined || funct.icon == undefined || funct.mode == undefined) {
                console.log(`Invalid train function data`);
                continue;
            }

            const icon = TrainFunctionIcons[funct.icon as keyof typeof TrainFunctionIcons];
            const mode = funct.mode as TrainFunctionModes;
            const uuid = funct.uuid as TrainFunctionUUID;

            serverTrain.addFunction(uuid, funct.value, funct.name, icon, mode);         
        }

        return serverTrain;
    }


    addFunction(uuid: TrainFunctionUUID, value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes) {
        const funct = new ServerTrainFunctions(uuid, value, name, icon, mode);
        this.functions.set(uuid, funct);
    }
}