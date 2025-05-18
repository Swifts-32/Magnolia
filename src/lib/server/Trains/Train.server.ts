import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { TrainAddress, TrainUuid } from "$lib/types/Trains/Train";
import { ServerTrainFunctions } from "./Functions.server";
import { TrainDirection } from "$lib/client/Trains/Train.svelte";

export class ServerTrain {
	public uuid: TrainUuid;
	public layoutUuid: LayoutUUID;

	public address: TrainAddress | undefined;
	public connUuid: ConnectionUUID | undefined;

	public name: string = "New Train";
	public comment: string = "";

	public functions: Map<string, ServerTrainFunctions> = new Map();
	public speed: number = 0;
	public direction: TrainDirection = TrainDirection.Unknown;

	constructor(uuid: TrainUuid, layoutUuid: LayoutUUID) {
		this.uuid = uuid;
		this.layoutUuid = layoutUuid;
	}

	public toJsonWeb(): string {
		return JSON.stringify({
			uuid: this.uuid,
			layoutUuid: this.layoutUuid,
			address: this.address,
			connUuid: this.connUuid,
			name: this.name,
			comment: this.comment,
			functions: Array.from(this.functions.values()).map(funct => funct.toJson()),
			speed: this.speed,
			direction: this.direction,
		});
	}

	public toJsonFile(): string {
		return JSON.stringify({
			uuid: this.uuid,
			layoutUuid: this.layoutUuid,
			address: this.address,
			connUuid: this.connUuid,
			name: this.name,
			comment: this.comment,
			functions: Array.from(this.functions.values()).map(funct => funct.toJson()),
		});
	}

	public static fromJsonWeb(json: any): ServerTrain | null {
		try {
			const uuid = json.uuid;
			const layoutUuid = json.layoutUuid;

			if (!uuid || !layoutUuid) return null;

			const serverTrain = new ServerTrain(uuid, layoutUuid);

			serverTrain.address = json.address;
			serverTrain.connUuid = json.connUuid;
			serverTrain.name = json.name;
			serverTrain.comment = json.comment;
			serverTrain.functions = ServerTrain.parseFunctionsFromJson(json.functions);
			serverTrain.speed = json.speed;
			serverTrain.direction = json.direction;

			return serverTrain;
		}
		catch (e) {
			console.warn(`Failed to parse train data from api: ${e}`);
		}

		return null;
	}

	public static fromJsonFile(json: any): ServerTrain | null {
		try {
			const uuid = json.uuid;
			const layoutUuid = json.layoutUuid;

			if (!uuid || !layoutUuid) return null;

			const serverTrain = new ServerTrain(uuid, layoutUuid);

			serverTrain.address = json.address;
			serverTrain.connUuid = json.connUuid;
			serverTrain.name = json.name;
			serverTrain.comment = json.comment;
			serverTrain.functions = ServerTrain.parseFunctionsFromJson(json.functions);

			return serverTrain;
		}
		catch (e) {
			console.warn(`Failed to parse train data from file: ${e}`);
		}

		return null;
	}

	private static parseFunctionsFromJson(json: any): Map<string, ServerTrainFunctions> {
		const functions = new Map<string, ServerTrainFunctions>();

		for (const funct of json) {
			const serverTrainFunctions = ServerTrainFunctions.fromJson(funct);
			if (serverTrainFunctions) {
				functions.set(serverTrainFunctions.value, serverTrainFunctions);
			}
		}

		return functions;
	}
}