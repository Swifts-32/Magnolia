import type { TrainFunctionIcons, TrainFunctionModes } from "$lib/types/Trains/Functions/Functions";
import type { TrainAddress } from "$lib/types/Trains/Train";
import type { TrainUUID } from "$lib/types/Trains/Train";
import { layoutClientHandler } from "../../../services/Layouts/LayoutClientHandler.svelte";
import type { ConnectionUUID, LayoutUUID } from "../LayoutClient.svelte";
import { ConnectionProtocols } from "../Protocols/protocols";
import { TrainClientFunction } from "./Functions/Function.svelte";

export enum TrainDirection {
	Reverse = 0,
	Forward = 1,
}

export class ClientTrain {
	// Train data
	public uuid: TrainUUID;
	public address: TrainAddress = $state() as TrainAddress;
	public name: string = $state() as string;
	public functions: Map<string, TrainClientFunction> = $state(new Map());

	public layoutUUID: LayoutUUID;
	public connUUID: ConnectionUUID = $state() as ConnectionUUID;

	// Non-Saveable Data

	// Direction
	public _direction: TrainDirection = $state(TrainDirection.Forward);
	public get direction(): TrainDirection {
		return this._direction;
	}
	public set direction(value: TrainDirection) {
		let layout = layoutClientHandler.layouts.get(this.layoutUUID);
		if (!layout) {
			console.error(`Layout not found when trying to update train direction: ${this.name}`);
			return;
		}

		let connection = layout.connections.get(this.connUUID);
		if (!connection) {
			console.error(`Connection not found when trying to update train direction: ${this.name}`);
			return;
		}

		this._direction = value;

		switch (connection.protocol) {
			case ConnectionProtocols.DCCEX:
				fetch(`/api/layout/${this.layoutUUID}/${this.connUUID}/write?data=<t ${this.address} ${this.speed} ${this.direction}>`);
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
		let layout = layoutClientHandler.layouts.get(this.layoutUUID);
		if (!layout) {
			console.error(`Layout not found when trying to update train speed: ${this.name}`);
			return;
		}
		
		let connection = layout.connections.get(this.connUUID);
		if (!connection) {
			console.error(`Connection not found when trying to update train speed: ${this.name}`);
			return;
		}

		this._speed = value;

		switch (connection.protocol) {
			case ConnectionProtocols.DCCEX:
				fetch(`/api/layout/${this.layoutUUID}/${this.connUUID}/write?data=<t ${this.address} ${this.speed} ${this.direction}>`);
				break;
			default:
				console.log("Unknown protocol: " + connection.protocol);
				break;
		}
	}

	public updateSpeedLocal(value: number) {
		this._speed = value;
	}

	constructor(uuid: TrainUUID, address: TrainAddress, name: string, connUUID: ConnectionUUID, layoutUUID: LayoutUUID) {
		this.uuid = uuid;
		this.address = address;
		this.name = name;

		this.connUUID = connUUID;
		this.layoutUUID = layoutUUID;
	}

	public addFunctions(functions: TrainClientFunction[]) {
		functions.forEach((func) => {
			this.functions.set(func.value, func);
		});
	}

	public addFunction(value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes, position: number, layoutUUID: LayoutUUID) {
		this.functions.set(value, new TrainClientFunction(value, name, icon, mode, position, this.uuid, this.connUUID, layoutUUID));
	}

	// Create a deep copy of the train
	public clone(): ClientTrain {
		const clonedTrain = new ClientTrain(this.uuid, this.address, this.name, this.connUUID, this.layoutUUID);

		// Clone the functions Map
		this.functions.forEach((func) => {
			clonedTrain.functions.set(func.value, func.clone());
		});

		return clonedTrain;
	}
}


