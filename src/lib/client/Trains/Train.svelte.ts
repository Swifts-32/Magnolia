// import type { TrainAddress } from "$lib/types/Trains/Train";
// import type { TrainUuid } from "$lib/types/Trains/Train";
// import { SvelteMap } from "svelte/reactivity";
// import type { ConnectionUUID, LayoutUUID } from "../LayoutClient.svelte";
// import { TrainClientFunction } from "./Functions/Function.svelte";
import { z } from "zod/v4";

const trainDirection = ["Reverse", "Forward", "Unknown"] as const;
export const TrainDirection = z.enum(trainDirection);
export type TrainDirection = z.infer<typeof TrainDirection>;

// export class ClientTrain {
// 	public uuid: TrainUuid;
// 	public layoutUuid: LayoutUUID;

// 	public address: TrainAddress | undefined = $state(undefined);
// 	public connUuid: ConnectionUUID | undefined = $state(undefined);

// 	public name: string = $state("");
// 	public comment: string = $state("");

// 	public functions: SvelteMap<string, TrainClientFunction> = new SvelteMap();

// 	// Direction
// 	public _direction: TrainDirection = $state("Unknown");
// 	public get direction(): TrainDirection {
// 		return this._direction;
// 	}
// 	public set direction(value: TrainDirection) {
// 		fetch(`/api/layout/${this.layoutUuid}/trains/${this.uuid}/direction`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				direction: value,
// 			}),
// 		});
// 		this._direction = value;
// 	}
// 	public updateDirectionLocal(value: TrainDirection) {
// 		this._direction = value;
// 	}

// 	// Speed
// 	private _speed: number = $state(0);
// 	public get speed(): number {
// 		return this._speed;
// 	}
// 	public set speed(value: number) {
// 		fetch(`/api/layout/${this.layoutUuid}/trains/${this.uuid}/speed`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				speed: value,
// 			}),
// 		});
// 		this._speed = value;
// 	}

// 	public updateSpeedLocal(value: number) {
// 		this._speed = value;
// 	}

// 	constructor(uuid: TrainUuid, layoutUuid: LayoutUUID) {
// 		this.uuid = uuid;
// 		this.layoutUuid = layoutUuid;
// 	}

// 	public toJsonWeb(): string {
// 		return JSON.stringify({
// 			uuid: this.uuid,
// 			layoutUuid: this.layoutUuid,
// 			address: this.address,
// 			connUuid: this.connUuid,
// 			name: this.name,
// 			comment: this.comment,
// 			functions: Array.from(this.functions.values()).map(funct => funct.toJson()),
// 			speed: this.speed,
// 			direction: this.direction,
// 		});
// 	}

// 	public static fromJsonWeb(json: any): ClientTrain | null {
// 		json = JSON.parse(json);

// 		const uuid = json.uuid;
// 		const layoutUuid = json.layoutUuid;

// 		if (!uuid || !layoutUuid) {
// 			console.error("Failed to load train from json: Undefined train uuid or layout uuid")
// 			return null;
// 		};
// 		const train = new ClientTrain(uuid, layoutUuid);

// 		train.address = json.address;
// 		train.connUuid = json.connUuid;
// 		train.name = json.name;
// 		train.comment = json.comment;
// 		train.speed = json.speed;
// 		train.direction = json.direction;

// 		train.functions = new SvelteMap();
// 		for (const functJson of json.functions) {
// 			const funct = TrainClientFunction.fromJson(JSON.parse(functJson));
// 			if (funct) {
// 				train.functions.set(funct.value, funct);
// 			}
// 		}

// 		return train;
// 	}

// 	// Create a deep copy of the train
// 	public clone(): ClientTrain {
// 		const clonedTrain = new ClientTrain(this.uuid, this.layoutUuid);

// 		clonedTrain.address = this.address;
// 		clonedTrain.connUuid = this.connUuid;
// 		clonedTrain.name = this.name;
// 		clonedTrain.comment = this.comment;
// 		clonedTrain.speed = this.speed;
// 		clonedTrain.direction = this.direction;

// 		// Clone the functions Map
// 		this.functions.forEach((func) => {
// 			clonedTrain.functions.set(func.value, func.clone());
// 		});

// 		return clonedTrain;
// 	}

// 	public emergencyStop() {
// 		// TODO Implement emergency stop for the train
// 	}
// }


