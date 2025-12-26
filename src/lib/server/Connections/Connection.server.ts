import { eq } from "drizzle-orm";
import { db } from "../db";
import { Lcc } from "./Protocol/Lcc/Lcc";
import { DccEx } from "./Protocol/DccEx/DccEx";
import { ConnectionTable } from "../db/schema/connection";
import { SerialConnection } from "./Hardware/Serial/SerialConnection.server";
import { getConnections, type ConnectionHardwareType } from "../../client/Connections/connections.remote";
import type { HardwareClass } from "./Hardware/hardware";
import type { IProtocol } from "./Protocol/IProtocol";
import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import { protocolEvents } from "$lib/server/events";

export class Connection {
  public id: string;
  public layoutId: string;
  public name: string;
  public protocol: IProtocol | undefined;
  public hardware: HardwareClass | undefined;

  get isConnected(): boolean {
    if (!this.hardware) return false;
    return this.hardware.isConnected;
  }

  constructor(id: string, name: string, hardware: ConnectionHardwareType, protocol: ConnectionProtocol, layoutId: string) {
    this.id = id;
    this.layoutId = layoutId;
    this.name = name;

    switch (protocol) {
      case "DccEx":
        this.protocol = new DccEx(this.id);
        break;

      case "Lcc":
        // this.protocol = new Lcc(this.id);
      default:
        break;
    }

    if (this.protocol) {
      this.protocol.setEventEmitter(protocolEvents);
    }

    // Reset connection status
    this.disconnect();

    switch (hardware.type) {
      case "Serial":
        if (!hardware.path || !hardware.baudRate) break;

        this.hardware = new SerialConnection(hardware.path, hardware.baudRate);
        break;

      default:
        break;
    }
  }

  public async connect(): Promise<boolean | string> {

    // Process received data
    this.hardware?.onDataReceived((data: string) => this.protocol?.processCommand(data));

    try {
      const connected = await this.hardware?.connect();
      await db.update(ConnectionTable).set({
        isConnected: connected,
      }).where(eq(ConnectionTable.uuid, this.id));

      await getConnections(this.layoutId).refresh();
      return connected ?? false;
    }
    catch (e) {
      return e as string;
    }
  }

  public async disconnect(): Promise<boolean | string> {
    try {
      const result = await this.hardware?.disconnect();
      const disconnected = result ?? true;

      await db.update(ConnectionTable).set({
        isConnected: !disconnected,
      }).where(eq(ConnectionTable.uuid, this.id));

      await getConnections(this.layoutId).refresh();
      return disconnected;
    }
    catch (e) {
      return e as string;
    }
  }

  public write(data: string) {
    this.hardware?.write(data);
  }
}

export async function getConnectionsFromDb(connectionId: string) {
  return await db.select().from(ConnectionTable).where(eq(ConnectionTable.uuid, connectionId));
}