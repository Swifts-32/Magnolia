import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { ConnectionProtocols } from "$lib/client/Protocols/protocols";
import type { ITrainFunctionData, TrainFunctionIcons, TrainFunctionModes } from "$lib/types/Trains/Functions/Functions";
import type { TrainUUID } from "$lib/types/Trains/Train";
import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";

export class TrainClientFunction {
	value: string = $state() as string; // E.g. 1 for F1 or 1123.2434.35 LCC.
	name: string = $state() as string; // User friendly display name

	icon: TrainFunctionIcons = $state() as TrainFunctionIcons;
	mode: TrainFunctionModes = $state() as TrainFunctionModes;
	visible: boolean = $state(true);
	position: number = $state() as number;
	trainUUID: TrainUUID;
	connUUID: ConnectionUUID;
	layoutUUID: LayoutUUID;


	// Function state
	private _state: boolean = $state(false);
	public get state(): boolean {
		return this._state;
	}
	public set state(value: boolean) {
		let layout = layoutClientHandler.layouts.get(this.layoutUUID);
		if (!layout) {
			console.error(`Layout not found when trying to update function state: ${this.name}`);
			return;
		}

		let connection = layout.connections.get(this.connUUID);
		if (!connection) {
			console.error("Connection not found when trying to update function state: " + this.name);
			return;
		}

		const train = connection.trains.get(this.trainUUID);
		if (!train) {
			console.error("Train not found when trying to update function state: " + this.name);
			return;
		}

		this._state = value;

		// Update the function on the server
		switch (connection.protocol) {
			case ConnectionProtocols.DCCEX:
				fetch(`/api/layout/${this.layoutUUID}/${this.connUUID}/write?data=<F ${train.address} ${this.value} ${this.state ? 1 : 0}>`);
				break;
			default:
				console.log("Unknown protocol: " + connection.protocol);
				break;
		}
	}

	// Update the state of the function locally without sending a request to the server
	public updateStateLocal(state: boolean) {
		this._state = state;
	}

	constructor(value: string, name: string, icon: TrainFunctionIcons, mode: TrainFunctionModes, position: number, trainUUID: TrainUUID, connUUID: ConnectionUUID, layoutUUID: LayoutUUID) {
		this.value = value;
		this.name = name;

		this.mode = mode;
		this.icon = icon;
		this.position = position;

		this.trainUUID = trainUUID;
		this.connUUID = connUUID;
		this.layoutUUID = layoutUUID;

	}

	toJSON(): ITrainFunctionData {
		return {
			value: this.value,
			name: this.name,

			icon: this.icon,
			mode: this.mode,
			visible: this.visible,
			position: this.position,
			trainUUID: this.trainUUID,
			connUUID: this.connUUID,
			layoutUUID: this.layoutUUID
		};
	}

	public clone(): TrainClientFunction {
		const clonedFunction = new TrainClientFunction(this.value, this.name, this.icon, this.mode, this.position, this.trainUUID, this.connUUID, this.layoutUUID);
		clonedFunction.state = this.state;

		return clonedFunction;
	}
}