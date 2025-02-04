import { SerialConnection } from "$lib/server/Connections/Serial/SerialConnection.server";
import { ConnectionProtocols } from "./client/Protocols/protocols";
import { type ConnectionType } from "./server/Connections/connection";
import { EmulatorConnection } from "./server/Connections/Emulator/Emulator.server";

export class Layout {
  public name: string;
  public rank: number = 0;
  public connections: Map<string, ConnectionType> = new Map();

  private controllers: Set<ReadableStreamDefaultController> = new Set();

  constructor(name: string) {
    this.name = name;
  }

  createStream(): ReadableStream {
    let streamController: ReadableStreamDefaultController;

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


  /**
   * Creates a DCC serial connection
   * @param path 
   * @param baudRate 
   */
  createDccSerialConnection(protocol: ConnectionProtocols, path: string, baudRate: number, connName: string) {
    const connection = new SerialConnection(protocol, path, baudRate, connName);
    const connUUID = crypto.randomUUID();


    connection.onDataReceived((data: string) => {
      const message = `data: Cid:${connUUID}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });

    this.connections.set(connUUID, connection);
  }

  /**
   * Creates an emulated DCC EX connection
   */
  createDccEmulatorConnection(protocol: ConnectionProtocols, connName: string) {
    const connection = new EmulatorConnection(protocol, connName);
    const connUUID = crypto.randomUUID();


    connection.onDataReceived((data: string) => {
      // if (!this.streamController) return console.log(`Failed to send "${data}" to server - Stream controller is null.`);
      // this.streamController.enqueue(`data: Cid:${connUUID}: ${data}\n\n`);

      const message = `data: Cid:${connUUID}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });

    this.connections.set(connUUID, connection);

  }
}
