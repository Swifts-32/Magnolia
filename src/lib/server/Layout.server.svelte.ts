import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server";
import { ConnectionProtocols } from "../client/Protocols/protocols";
import { Connection } from "./Connections/connection.svelte";
import { EmulatorConnection } from "./Connections/Hardware/Emulator/Emulator.server";
import { ServerTrain } from "./Trains/Train.server";
import { type TrainAddress, type TrainUUID } from "$lib/types/Trains/Train";

export class Layout {
  public name: string;
  public uuid: LayoutUUID;
  public position: number = 0;
  public connections: Map<ConnectionUUID, Connection> = new Map();

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
    };
  }

  static fromJSON(json: any): Layout | null {
    if (json.uuid == undefined || json.name == undefined || json.position == undefined) {
      console.log(`Invalid layout data, ${json.uuid} ${json.name} ${json.position}`);
      return null;
    }

    const layout = new Layout(json.name, json.uuid);
    layout.position = json.position;

    // Recreate connections
    for (const conn of json.connections) {
      const connection = Connection.fromJSON(conn);
      if (connection) {
        layout.createConnection(connection);
      }
    }

    return layout;
  }
  
  createStream(): ReadableStream {
    let streamController: ReadableStreamDefaultController;


    console.log("Creating stream");
    return new ReadableStream({
      start: (controller) => {
        streamController = controller;
        this.controllers.add(controller);
        controller.enqueue("Connected\n");
      },
      cancel: (reason) => {
        this.controllers.delete(streamController);
      }
    });
  }


  addTrain(address: TrainAddress, trainName: string, connUUID: ConnectionUUID, trainUUID: TrainUUID | undefined = undefined): ServerTrain | undefined {
    const connection = this.connections.get(connUUID);
    
    if (connection) {
      const train = new ServerTrain(address, trainName, connUUID, trainUUID);
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

    hardware.onDataReceived((data: string) => {
      const message = `data: Cid:${connUUID}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });

    const connection = new Connection(hardware, connName, protocol, connUUID);
    this.connections.set(connUUID, connection);

    return connection;
  }

  /**
   * Creates an emulated DCC EX connection
   */
  createEmulatorConnection(protocol: ConnectionProtocols, connName: string): Connection {
    const hardware = new EmulatorConnection();
    const connUUID = crypto.randomUUID();
    
    hardware.onDataReceived((data: string) => {
      const message = `data: Cid:${connUUID}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });
    
    const connection = new Connection(hardware, connName, protocol, connUUID);
    this.connections.set(connUUID, connection);

    return connection;
  }

  createConnection(connection: Connection): Connection {
    connection.hardware.onDataReceived((data: string) => {
      const message = `data: Cid:${connection.uuid}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });

    this.connections.set(connection.uuid, connection);
    return connection;
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
