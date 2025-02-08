import type { TrainAddress } from "$lib/server/Trains/Train.server";

import type { TrainUUID } from "$lib/server/Trains/Train.server";
import type { ConnectionUUID } from "../LayoutClient.svelte";

export class ClientTrain {
    public uuid: TrainUUID;
    public address: TrainAddress;
    public name: string;
    public connUUID: ConnectionUUID;

    constructor(uuid: TrainUUID, address: TrainAddress, name: string, connUUID: ConnectionUUID) {
        this.uuid = uuid;
        this.address = address;
        this.name = name;
        this.connUUID = connUUID;
    }
}


