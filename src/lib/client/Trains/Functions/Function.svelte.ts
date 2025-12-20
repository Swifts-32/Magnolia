import type { TrainFunctionIcons, TrainFunctionModes } from "$lib/types/Trains/Functions/Functions";
import type { TrainUuid } from "$lib/types/Trains/Train";
import { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";

export class TrainClientFunction {
	public value: string = $state() as string; // E.g. 1 for F1 or 1123.2434.35 LCC.
	public trainUuid: TrainUuid;

	public name: string = $state() as string; // User friendly display name
	public icon: TrainFunctionIcons = $state("Text");
	public mode: TrainFunctionModes = $state("Toggle");
	public visible: boolean = $state(true);
	public position: number = $state(0);

	// Function state
	private _state: boolean = $state(false);
	public get state(): boolean {
		return this._state;
	}
	public set state(value: boolean) {
		const layout = layoutClientHandler.layouts.values().find(layout => layout.trains.has(this.trainUuid));
		if (!layout) {
			console.error(`Layout not found when trying to update function state: ${this.name}`);
			return;
		}

		const train = layout.trains.get(this.trainUuid);
		if (!train) {
			console.error("Train not found when trying to update function state: " + this.name);
			return;
		}

		if (train.connUuid === undefined) {
			console.error("Connection UUID is undefined");
			return;
		}

		const connection = layout.connections.get(train.connUuid);
		if (!connection) {
			console.error("Connection not found when trying to update function state: " + this.name);
			return;
		}

		this._state = value;

		// Update the function on the server
		switch (connection.protocol) {
			case ConnectionProtocol.DCCEX:
				fetch(`/api/layout/${layout.uuid}/${train.connUuid}/write?data=<F ${train.address} ${this.value} ${this.state ? 1 : 0}>`);
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

	constructor(value: string, trainUuid: TrainUuid) {
		this.value = value;
		this.trainUuid = trainUuid;
	}

	public toJson(): string {
		return JSON.stringify({
			value: this.value,
			trainUuid: this.trainUuid,
			name: this.name,
			icon: this.icon,
			mode: this.mode,
			visible: this.visible,
			position: this.position,
			state: this.state,
		});
	}

	public static fromJson(json: any): TrainClientFunction | null {
		const value = json.value;
		const trainUuid = json.trainUuid;

		if (!value || !trainUuid) return null;

		const funct = new TrainClientFunction(value, trainUuid);

		funct.name = json.name;
		funct.icon = json.icon;
		funct.mode = json.mode;
		funct.visible = json.visible;
		funct.position = json.position;
		funct.state = json.state;

		return funct;
	}

	public clone(): TrainClientFunction {
		const clonedFunction = new TrainClientFunction(this.value, this.trainUuid);
		clonedFunction.updateStateLocal(this.state); // Don't send a request to the server

		return clonedFunction;
	}
}