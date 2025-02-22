import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import { ServerTrainFunctions } from "./Functions.server";
import { isFunctionData, type TrainFunctionIcons, type TrainFunctionModes } from "../../types/Trains/Functions/Functions";
import { type TrainUUID, type TrainAddress, type ITrainData, isTrainData } from "$lib/types/Trains/Train";

export class ServerTrain {
	public uuid: TrainUUID;
	public connUUID: ConnectionUUID;
	public address: TrainAddress;
	public name: string;
	public functions: Map<string, ServerTrainFunctions> = new Map();

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

		if (!isTrainData(json)) {
			console.log(`Invalid train data`);
			return null;
		}

		let serverTrain = new ServerTrain(json.address, json.name, json.connUUID, json.uuid);

		for (const funct of json.functions) {
			if (!isFunctionData(funct)) {
				console.log(`Invalid train function data`);
				continue;
			}

			serverTrain.addFunction(funct.value, funct.name, funct.icon, funct.mode, funct.position);
		}

		return serverTrain;
	}


	addFunction(value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes, position: number) {
		const funct = new ServerTrainFunctions(value, name, icon, mode, position);
		this.functions.set(value, funct);
	}
}