import { eq } from "drizzle-orm";
import { db } from "../../server/db";
import { Lcc } from "./Protocols/Lcc/server/Lcc";
import { DccEx } from "./Protocols/DccEx/server/DccEx";
import { ConnectionTable } from "../../server/db/schema/connection";
import { SerialConnection } from "./Hardware/server/Serial/SerialConnection.server";
import type { IHardware } from "./Hardware/server/IHardware";
import { EmulatorConnection } from "./Hardware/server/Emulator/Emulator.server";
import { AsyncEventQueue } from "../../server/eventQueue";
import { Sunbeam } from "./Protocols/Sunbeam/server/Sunbeam";
import type { ConnectionHardware } from "#lib/components/Connections/Hardware/hardwareConstants.ts";
import { WebServerConnection } from "./Hardware/server/WebServer/WebServerConnection.server";
import type { BaseProtocol } from "./Protocols/BaseProtocol";
import type { ConnectionProtocol } from "./Protocols/protocolTypes";

export class Connection {
  public id: string;
  public layoutId: string;
  public name: string;

  public protocol: BaseProtocol | undefined;
  public hardware: IHardware | undefined;
  public hardwareQueue = new AsyncEventQueue<string>();

  get isConnected(): boolean {
    if (!this.hardware) return false;
    return this.hardware.isConnected;
  }

  constructor(
    id: string,
    name: string,
    hardware: ConnectionHardware,
    protocol: ConnectionProtocol,
    layoutId: string,
  ) {
    this.id = id;
    this.layoutId = layoutId;
    this.name = name;

    switch (protocol) {
      case "DccEx":
        this.protocol = new DccEx(this.id);
        break;

      case "Sunbeam":
        this.protocol = new Sunbeam(this.id);
        break;

      case "Lcc":
      // this.protocol = new Lcc(this.id);
      default:
        break;
    }

    if (this.protocol) {
      this.protocol.onParsedOutput((parsedData) => {
        this.hardwareQueue.push(parsedData);
      });
    }

    // Reset connection status
    this.disconnect();

    switch (hardware.type) {
      case "Serial":
        if (!hardware.path || !hardware.baudRate) break;
        this.hardware = new SerialConnection(hardware.path, hardware.baudRate);
        break;

      case "WebServer":
        if (!hardware.baseUrl) break;
        this.hardware = new WebServerConnection(
          hardware.baseUrl,
          hardware.headers,
        );
        break;

      case "Emulator":
        this.hardware = new EmulatorConnection();

      default:
        break;
    }
  }

  public async connect() {
    if (!this.hardware)
      return {
        success: false,
        error: "Hardware undefined",
      };

    // Process received data
    this.hardware.onDataReceived((data: Buffer) => {
      this.protocol?.processCommand(data);
    });
    const connected = await this.hardware.connect();

    await db
      .update(ConnectionTable)
      .set({
        isConnected: connected,
      })
      .where(eq(ConnectionTable.uuid, this.id));

    return {
      success: connected,
    };
  }

  public async disconnect(): Promise<boolean | string> {
    try {
      const result = await this.hardware?.disconnect();
      const disconnected = result ?? true;

      await db
        .update(ConnectionTable)
        .set({
          isConnected: !disconnected,
        })
        .where(eq(ConnectionTable.uuid, this.id));

      return disconnected;
    } catch (e) {
      return e as string;
    }
  }

  public async write(data: Buffer) {
    if (!this.hardware)
      return console.error("Failed to write as hardware undefined");
    await this.hardware.write(data);
  }
}
