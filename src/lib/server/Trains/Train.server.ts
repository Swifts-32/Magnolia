import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { TrainAddress, TrainUuid } from "$lib/types/Trains/Train";
import { ServerTrainFunctions } from "./Functions.server";
import { TrainDirection } from "$lib/client/Trains/Train.svelte";
import { db } from "../db";
import { TrainTable } from "../db/schema/trains";
import { eq } from "drizzle-orm";

export class ServerTrain {
	public uuid: TrainUuid;
	public layoutUuid: LayoutUUID;

	public address: TrainAddress | undefined;
	public connUuid: ConnectionUUID | undefined;

	public name: string = "New Train";
	public comment: string = "";

	public functions: Map<string, ServerTrainFunctions> = new Map();
	public speed: number = 0;
	public direction: TrainDirection = "Unknown";

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

	public static async getTrainFromDb(trainId: TrainUuid): Promise<ServerTrain | undefined> {
		const dbTrains = await db.select().from(TrainTable).where(eq(TrainTable.uuid, trainId));
		const dbTrain = dbTrains[0];
		if (!dbTrain) return;

		const train = new ServerTrain(dbTrain.uuid as TrainUuid, dbTrain.layoutUuid as LayoutUUID);

		train.address = dbTrain.address;
		train.comment = dbTrain.comment;
		if (dbTrain.connectionUuid) train.connUuid = dbTrain.connectionUuid as ConnectionUUID;
		train.direction = dbTrain.direction;
		train.name = dbTrain.name;
		train.speed = train.speed;
		train.functions = await ServerTrainFunctions.getFunctionsFromDb(train.uuid);

		return train;
	}

	public static async acquireTrain(trainId: TrainUuid): Promise<ServerTrain | undefined> {
		const dbTrains = await db.select().from(TrainTable).where(eq(TrainTable.uuid, trainId));
		const dbTrain = dbTrains[0];
		if (!dbTrain) return;

		const train = new ServerTrain(dbTrain.uuid as TrainUuid, dbTrain.layoutUuid as LayoutUUID);

		train.address = dbTrain.address;
		train.comment = dbTrain.comment;
		if (dbTrain.connectionUuid) train.connUuid = dbTrain.connectionUuid as ConnectionUUID;
		train.direction = dbTrain.direction;
		train.name = dbTrain.name;
		train.speed = train.speed;
		train.functions = await ServerTrainFunctions.getFunctionsFromDb(train.uuid);

		await db.in

		return train;
	}

	public static async setTrainDirection(trainId: TrainUuid, direction: TrainDirection) {

		// TODO set train direction;
		
		// const connection = layoutClientHandler.layouts.get(this.layoutUuid)?.connections.get(this.connUuid);
		// if (!connection) return;

		// this._direction = value;

		// switch (connection.protocol) {
		// 	case ConnectionProtocols.DCCEX:
		// 		fetch(`/api/layout/${this.layoutUuid}/${this.connUuid}/write?data=<t ${this.address} ${this.speed} ${this.direction}>`);
		// 		break;
		// 	default:
		// 		console.log("Unknown protocol: " + connection.protocol);
		// 		break;
		// }
	}
	public static async setTrainSpeed(trainId: TrainUuid, speed: number) {

		// TODO set train speed;

		// const connection = layoutClientHandler.layouts.get(this.layoutUuid)?.connections.get(this.connUuid);
		// if (!connection) return;

		// this._direction = value;

		// switch (connection.protocol) {
		// 	case ConnectionProtocols.DCCEX:
		// 		fetch(`/api/layout/${this.layoutUuid}/${this.connUuid}/write?data=<t ${this.address} ${this.speed} ${this.direction}>`);
		// 		break;
		// 	default:
		// 		console.log("Unknown protocol: " + connection.protocol);
		// 		break;
		// }
	}

}