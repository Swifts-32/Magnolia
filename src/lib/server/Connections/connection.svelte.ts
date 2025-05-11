import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { ConnectionTypes, type ConnectionProtocols } from "$lib/client/Protocols/protocols";
import { ServerTrain } from "../Trains/Train.server";
import type { TrainAddress, TrainUUID } from "$lib/types/Trains/Train";
import { EmulatorConnection } from "./Hardware/Emulator/Emulator.server";
import type { HardwareTypes } from "./Hardware/hardware";
import { SerialConnection } from "./Hardware/Serial/SerialConnection.server";

export class Connection {
    public name: string;
    public protocol: ConnectionProtocols;
    public uuid: ConnectionUUID;
    private hardware: HardwareTypes;
    public trains: Map<TrainUUID, ServerTrain> = new Map();

    public get isConnected(): boolean {
        return this.hardware.isConnected
    };

    constructor(connection: HardwareTypes, name: string, protocol: ConnectionProtocols, uuid: ConnectionUUID, trains: Map<TrainUUID, ServerTrain> = new Map()) {
        this.hardware = connection;
        this.name = name;
        this.protocol = protocol;
        this.uuid = uuid;
        this.trains = trains;
    }

    toJSON() {
        return {
            name: this.name,
            protocol: this.protocol,
            uuid: this.uuid,
            hardware: this.hardware.toJSON(),
            isConnected: this.isConnected,
            trains: Array.from(this.trains.values()).map(train => train.toJSON())
        };
    }

    public static fromJSON(json: any): Connection | null {
        if (json.uuid == undefined || json.name == undefined || json.protocol == undefined || json.hardware.connType == undefined) {
            console.log(`Invalid connection data`);
            return null;
        }

        let hardware: HardwareTypes;

        switch (json.hardware.connType) {
            case ConnectionTypes.Emulator:
                hardware = new EmulatorConnection();
                break;
            case ConnectionTypes.Serial:
                if (json.hardware.path == undefined || json.hardware.baudRate == undefined) {
                    console.log(`Invalid serial connection data`);
                    return null;
                }
                hardware = new SerialConnection(json.hardware.path, json.hardware.baudRate);
                break;

            default:
                console.log(`Unknown hardware type: ${json.hardware.connType}`);
                return null;
        }

        let trains: Map<TrainUUID, ServerTrain> = new Map();
        for (const trainData of json.trains) {
            let train = ServerTrain.fromJSON(trainData);
            if (train) {
                trains.set(train.uuid, train);
            }
        }

        return new Connection(hardware, json.name, json.protocol, json.uuid, trains);
    }

    addTrain(address: TrainAddress, trainName: string, layoutUUID: LayoutUUID, trainUUID: TrainUUID | undefined = undefined): ServerTrain | undefined {
        const train = new ServerTrain(address, trainName, this.uuid, layoutUUID, trainUUID);
        this.trains.set(train.uuid, train);
        return train;
    }


    async connect(): Promise<string> {
        return await this.hardware.connect();
    }


    async disconnect(): Promise<string> {
        return await this.hardware.disconnect();
    }


    write(data: string) {
        this.hardware.write(data);
    }

    public onDataRecieved(data: (data: string) => void) {
        this.hardware.onDataReceived((d) => {
            data(d);
        });
    }

    public addHardware(hardware: HardwareTypes) {
        this.hardware = hardware;
    }

}

