import type { TrainAddress } from "$lib/types/Trains/Train";
import type { TrainUuid } from "$lib/types/Trains/Train";
import { SvelteMap } from "svelte/reactivity";
import { layoutClientHandler } from "../../../services/Layouts/LayoutClientHandler.svelte";
import type { ConnectionUUID, LayoutUUID } from "../LayoutClient.svelte";
import { ConnectionProtocols } from "../Protocols/protocols";
import { TrainClientFunction } from "./Functions/Function.svelte";

export enum TrainDirection {
	Reverse = 0,
	Forward = 1,
	Unknown = 2,
}

export class ClientTrain {
	public uuid: TrainUuid;
	public layoutUuid: LayoutUUID;

	public address: TrainAddress | undefined = $state(undefined);
	public connUuid: ConnectionUUID | undefined = $state(undefined);

	public name: string = $state("");
	public comment: string = $state("");

	public functions: SvelteMap<string, TrainClientFunction> = new SvelteMap();

	// Direction
	public _direction: TrainDirection = $state(TrainDirection.Unknown);
	public get direction(): TrainDirection {
		return this._direction;
	}
	public set direction(value: TrainDirection) {
		if (this.connUuid === undefined) {
			console.warn("Connection is undefined - Trying to update train direction");
			return;
		}

		const connection = layoutClientHandler.layouts.get(this.layoutUuid)?.connections.get(this.connUuid);
		if (!connection) {
			console.warn("Could not find connection - Trying to update train direction");
			return;
		}

		this._direction = value;

		switch (connection.protocol) {
			case ConnectionProtocols.DCCEX:
				fetch(`/api/layout/${this.layoutUuid}/${this.connUuid}/write?data=<t ${this.address} ${this.speed} ${this.direction}>`);
				break;
			default:
				console.log("Unknown protocol: " + connection.protocol);
				break;
		}
	}
	public updateDirectionLocal(value: TrainDirection) {
		this._direction = value;
	}

	// Speed
	private _speed: number = $state(0);
	public get speed(): number {
		return this._speed;
	}
	public set speed(value: number) {
		if (this.connUuid === undefined) {
			console.warn("Connection is undefined - Trying to update train speed");
			return;
		}

		const connection = layoutClientHandler.layouts.get(this.layoutUuid)?.connections.get(this.connUuid);
		if (!connection) {
			console.warn("Could not find connection - Trying to update train speed");
			return;
		}

		this._speed = value;

		switch (connection.protocol) {
			case ConnectionProtocols.DCCEX:
				fetch(`/api/layout/${this.layoutUuid}/${this.connUuid}/write?data=<t ${this.address} ${this.speed} ${this.direction}>`);
				break;
			default:
				console.log("Unknown protocol: " + connection.protocol);
				break;
		}
	}

	public updateSpeedLocal(value: number) {
		this._speed = value;
	}

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

	public static fromJsonWeb(json: any): ClientTrain | null {
		json = JSON.parse(json);

		const uuid = json.uuid;
		const layoutUuid = json.layoutUuid;

		if (!uuid || !layoutUuid) {
			console.error("Failed to load train from json: Undefined train uuid or layout uuid")
			return null;
		};
		const train = new ClientTrain(uuid, layoutUuid);

		train.address = json.address;
		train.connUuid = json.connUuid;
		train.name = json.name;
		train.comment = json.comment;
		train.speed = json.speed;
		train.direction = json.direction;

		train.functions = new SvelteMap();
		for (const functJson of json.functions) {
			const funct = TrainClientFunction.fromJson(functJson);
			if (funct) {
				train.functions.set(funct.value, funct);
			}
		}

		
		return train;
	}

	// Create a deep copy of the train
	public clone(): ClientTrain {
		const clonedTrain = new ClientTrain(this.uuid, this.layoutUuid);

		clonedTrain.address = this.address;
		clonedTrain.connUuid = this.connUuid;
		clonedTrain.name = this.name;
		clonedTrain.comment = this.comment;
		clonedTrain.speed = this.speed;
		clonedTrain.direction = this.direction;

		// Clone the functions Map
		this.functions.forEach((func) => {
			clonedTrain.functions.set(func.value, func.clone());
		});

		return clonedTrain;
	}
}


