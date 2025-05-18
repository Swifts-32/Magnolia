import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server";
import { ConnectionProtocols } from "../client/Protocols/protocols";
import { Connection } from "./Connections/connection.svelte";
import { EmulatorConnection } from "./Connections/Hardware/Emulator/Emulator.server";
import { ServerTrain } from "./Trains/Train.server";
import { type TrainAddress, type TrainUuid } from "$lib/types/Trains/Train";
import { Sensor } from "./Sensors/Sensor";
import type { SensorUuid } from "$lib/client/Sensors/SensorClient.svelte";
import { LccSensor } from "./Sensors/LccSensor";
import { LayoutServerHandler } from "./layoutHandler.server.svelte";

export interface LayoutServerJsonWeb {

}

export class Layout {
  public name: string;
  public uuid: LayoutUUID;
  public position: number = 0;

  public connections: Map<ConnectionUUID, Connection> = new Map();

  // TODO to input
  private sensors: Map<SensorUuid, Sensor> = new Map();

  private trains: Map<TrainUuid, ServerTrain> = new Map();

  constructor(name: string, uuid: LayoutUUID) {
    this.name = name;
    this.uuid = uuid;
  }

  toJSON() {
    return {
      name: this.name,
      uuid: this.uuid,
      position: this.position,

      connections: Array.from(this.connections.values()).map(conn => conn.toJSON()),
      sensors: Array.from(this.sensors.values()).map(sensor => sensor.toJsonWeb()),
      trains: Array.from(this.trains.values()).map(train => train.toJsonWeb()),
    };
  }

  public static fromJSON(json: any): Layout | null {
    json = JSON.parse(json);

    const name = json.name;
    const uuid = json.uuid;

    if (!name || !uuid) {
      console.error("Failed to load layout: Undefined name or uuid");
      return null;
    };

    const layout = new Layout(json.name, json.uuid);
    layout.position = json.position;

    layout.loadConnectionsFromJson(json);
    layout.loadTrainsFromJson(json);
    layout.loadSensorsFromJson(json);

    return layout;
  }

  private loadConnectionsFromJson(json: any) {
    this.connections.clear();
    this.updateClientConnections();

    for (const conn of json.connections) {
      let connection = Connection.fromJsonWeb(conn);
      if (!connection) continue;

      this.createConnection(connection);

      console.log("Recreated connection", connection.name);
    }
  }

  private loadTrainsFromJson(json: any) {
    const trains: Map<TrainUuid, ServerTrain> = new Map();
    for (const trainJson of json.trains) {
      let train = ServerTrain.fromJsonFile(trainJson);
      if (train) {
        trains.set(train.uuid, train);
      }
    }

    this.trains = trains;
  }

  private loadSensorsFromJson(json: any) {
    this.sensors.clear();

    for (const sensor of json.sensors) {
      let newSensor = new Sensor(sensor.layoutUUID, sensor.uuid);

      newSensor.connUuid = sensor.connUUID;
      newSensor.name = sensor.name;
      newSensor.delayToActivate = sensor.delayToActivate;
      newSensor.delayToDeactivate = sensor.delayToDeactivate;
      newSensor.state = sensor.state;
      newSensor.comment = sensor.comment;
      newSensor.inverted = sensor.inverted;


      if (sensor.type === "basic") {
        newSensor.type = sensor.type;
      }
      else if (sensor.type === "lcc") {
        newSensor = newSensor as LccSensor;
        newSensor.type = sensor.type;

        if (newSensor instanceof LccSensor) {
          newSensor.activeEvents = sensor.activeEvents;
          newSensor.inactiveEvents = sensor.inactiveEvents;
        }
      }
      else {
        console.log("Unknown sensor type", sensor.type);
        continue;
      }

      this.sensors.set(sensor.uuid, newSensor);
    }
  }

  public createConnection(connection: Connection) {
    connection.onDataRecieved((data: string) => {
      const message = `LayoutUuid:${this.uuid}:ConnectionUuid:${connection.uuid}:${data}`

      if (LayoutServerHandler) {
        LayoutServerHandler.sendClientMessage("LayoutConnectionDataReceived", message);
      }
      else {
        console.log("Layout Server handler is undefined");
      }
    });

    this.connections.set(connection.uuid, connection);
    this.updateClientConnections();
  }

  public updateConnection(connection: Connection) {
    this.connections.set(connection.uuid, connection);
    this.updateClientConnections();
  }

  private updateClientConnections() {
    const json = `{"connections": ${JSON.stringify(Array.from(this.connections.values()).map(conn => conn.toJSON()))}}`;
    const message = `LayoutUuid:${this.uuid}:${json}`;

    if (LayoutServerHandler) {
      LayoutServerHandler.sendClientMessage("UpdateLayoutConnections", message);
    }
    else {
      console.log("Layout Server handler is undefined");
    }
  }

  private updateClientSensors() {
    const json = `{"sensors": ${JSON.stringify(Array.from(this.sensors.values()).map(sensor => sensor.toJsonWeb()))}}`;
    const message = `LayoutUuid:${this.uuid}:${json}`;

    if (LayoutServerHandler) {
      LayoutServerHandler.sendClientMessage("UpdateLayoutSensors", message);
    }
    else {
      console.log("Layout Server handler is undefined");
    }

  }

  public addTrain(train: ServerTrain) {
    this.trains.set(train.uuid, train);
  }

  public deleteTrain(trainUUID: TrainUuid) {
    this.trains.delete(trainUUID);
  }

  public getTrains(): Map<TrainAddress, ServerTrain> {
    return this.trains;
  }

  public getTrain(trainUuid: TrainUuid): ServerTrain | undefined {
    return this.trains.get(trainUuid);
  }

  public createSensor(name: string) {
    const sensor = new Sensor(this.uuid);
    sensor.name = name;
    this.sensors.set(sensor.uuid, sensor);

    this.updateClientSensors();
  }

  public deleteSensor(uuid: SensorUuid) {
    this.sensors.delete(uuid);
  }

}
