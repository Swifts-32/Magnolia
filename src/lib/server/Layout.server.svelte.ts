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

export interface LayoutServerJsonWeb {

}

export class Layout {
  public name: string;
  public uuid: LayoutUUID;
  public position: number = 0;

  public connections: Map<ConnectionUUID, Connection> = new Map();
  public sensors: SvelteMap<SensorUuid, Sensor> = new SvelteMap();

  private controllers: Set<ReadableStreamDefaultController> = new Set();

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
      let newSensor = new Sensor(sensor.connUUID, sensor.layoutUUID, sensor.uuid);
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

  /**
   * Creates a new stream for the layout
   * @returns ReadableStream
   */
  createStream(): ReadableStream {
    let streamController: ReadableStreamDefaultController;

    console.log("Creating stream");
    return new ReadableStream({
      start: (controller) => {
        streamController = controller;
        this.controllers.add(controller);
      },
      cancel: (reason) => {
        this.controllers.delete(streamController);
      }
    });
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
      const message = `data: Cid:${connection.uuid}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
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
    const message = `data: UpdateConn:${json}\n\n`;
    this.controllers.forEach(controller => controller.enqueue(message));
  }

  getTrain(trainUUID: TrainUUID): ServerTrain | undefined {
    for (const connection of this.connections.values()) {
      const train = connection.trains.get(trainUUID);
      if (train) {
        return train;
      }
    }
  }
}
