import type { LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server";
import { ConnectionProtocols } from "../client/Protocols/protocols";
import { Connection } from "./Connections/connection.server";
import { EmulatorConnection } from "./Connections/Hardware/Emulator/Emulator.server";

export class Layout {
  public name: string;
  public uuid: LayoutUUID;
  public position: number = 0;
  public connections: Map<string, Connection> = new Map();

  private controllers: Set<ReadableStreamDefaultController> = new Set();

  constructor(name: string, uuid: LayoutUUID) {
    this.name = name;
    this.uuid = uuid;
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


  /**
   * Creates a DCC serial connection
   * @param path 
   * @param baudRate 
   */
  createSerialConnection(protocol: ConnectionProtocols, path: string, baudRate: number, connName: string) {
    const hardware = new SerialConnection(path, baudRate);
    const connUUID = crypto.randomUUID();

    hardware.onDataReceived((data: string) => {
      const message = `data: Cid:${connUUID}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });

    const connection = new Connection(hardware, connName, protocol);
    this.connections.set(connUUID, connection);
  }

  /**
   * Creates an emulated DCC EX connection
   */
  createEmulatorConnection(protocol: ConnectionProtocols, connName: string) {
    const hardware = new EmulatorConnection();
    const connUUID = crypto.randomUUID();

    hardware.onDataReceived((data: string) => {
      const message = `data: Cid:${connUUID}: ${data}\n\n`;
      this.controllers.forEach(controller => controller.enqueue(message));
    });

    const connection = new Connection(hardware, connName, protocol);
    this.connections.set(connUUID, connection);
  }
}
