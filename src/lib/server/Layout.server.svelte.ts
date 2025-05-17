import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server";
import { ConnectionProtocols } from "../client/Protocols/protocols";
import { Connection } from "./Connections/connection.svelte";
import { EmulatorConnection } from "./Connections/Hardware/Emulator/Emulator.server";
import { ServerTrain } from "./Trains/Train.server";
import { type TrainAddress, type TrainUUID } from "$lib/types/Trains/Train";
import { SvelteMap } from "svelte/reactivity";
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
  private sensors: SvelteMap<SensorUuid, Sensor> = new SvelteMap();

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
    };
  }

  static fromJSON(json: any): Layout | null {
    if (json == undefined) {
      console.log("Invalid layout data");
      return null;
    }
    else if (json.uuid === undefined) {
      console.log("Invalid layout uuid");
      return null;
    }
    else if (json.name === undefined) {
      console.log("Invalid layout name");
      return null;
    }

    const layout = new Layout(json.name, json.uuid);
    layout.position = json.position;

    // Recreate connections
    layout.loadConnectionsFromJson(json);

    // Recreate Sensors
    layout.loadSensorsFromJson(json);

    return layout;
  }

  private loadConnectionsFromJson(json: any) {
    this.connections.clear();
    this.updateClientConnections();

    for (const conn of json.connections) {
      let connection = Connection.fromJSON(conn);
      if (!connection) continue;

      this.createConnection(connection);

      console.log("Recreated connection", connection.name);
    }
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

  addTrain(address: TrainAddress, trainName: string, connUUID: ConnectionUUID, layoutUUID: LayoutUUID, trainUUID: TrainUUID | undefined = undefined): ServerTrain | undefined {
    const connection = this.connections.get(connUUID);

    if (connection) {
      const train = new ServerTrain(address, trainName, connUUID, layoutUUID, trainUUID);
      connection.trains.set(train.uuid, train);
      return train;
    }
  }


  /**
   * Creates a DCC serial connection
   * @param path 
   * @param baudRate 
   */
  createSerialConnection(protocol: ConnectionProtocols, path: string, baudRate: number, connName: string): Connection {
    const hardware = new SerialConnection(path, baudRate);
    const connUUID = crypto.randomUUID();

    const connection = this.createConnection(new Connection(hardware, connName, protocol, connUUID));
    return connection;
  }

  /**
   * Creates an emulated DCC EX connection
   */
  createEmulatorConnection(protocol: ConnectionProtocols, connName: string): Connection {
    const hardware = new EmulatorConnection();
    const connUUID = crypto.randomUUID();

    const connection = this.createConnection(new Connection(hardware, connName, protocol, connUUID));
    return connection;
  }

  createConnection(connection: Connection): Connection {
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

    return connection;
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

  getTrain(trainUUID: TrainUUID): ServerTrain | undefined {
    for (const connection of this.connections.values()) {
      const train = connection.trains.get(trainUUID);
      if (train) {
        return train;
      }
    }
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
