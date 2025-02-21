import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import { ServerTrainFunctions } from "./Functions.server";
import { isFunctionData, type TrainFunctionIcons, type TrainFunctionModes, type TrainFunctionUUID } from "../../types/Trains/Functions/Functions";
import { type TrainUUID, type TrainAddress, type ITrainData, isTrainData } from "$lib/types/Trains/Train";

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

	toJSON(): ITrainData {
		return {
			uuid: this.uuid,
			connUUID: this.connUUID,
			address: this.address,
			name: this.name,
			functions: Array.from(this.functions.values()).map(funct => funct.toJSON()),
		};
	}

	public static fromJSON(json: any): ServerTrain | null {

		if (isTrainData(json)) {
			console.log(`Invalid train data`);
			return null;
		}

		let serverTrain = new ServerTrain(json.address, json.name, json.connUUID, json.uuid);

		for (const funct of json.functions) {

			if (!isFunctionData(funct)) {
				console.log(`Invalid train function data`);
				continue;
			}

			serverTrain.addFunction(funct.uuid, funct.value, funct.name, funct.icon, funct.mode);
		}

		return serverTrain;
	}


	addFunction(uuid: TrainFunctionUUID, value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes) {
		const funct = new ServerTrainFunctions(uuid, value, name, icon, mode);
		this.functions.set(uuid, funct);
	}
}