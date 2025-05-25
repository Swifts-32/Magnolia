import type { HardwareClass } from "./Hardware/hardware";
import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { ConnectionProtocol, ConnectionType } from "$lib/client/Protocols/protocols";
import { EmulatorConnection } from "./Hardware/Emulator/Emulator.server";
import { SerialConnection } from "./Hardware/Serial/SerialConnection.server";
import { DccEx } from "../Protocols/DccEx/DccEx";
import { LayoutServerHandler } from "../layoutHandler.server.svelte";
import { db } from "../db";
import { TrainFunctionTable, TrainTable } from "../db/schema/trains";
import { and, eq } from "drizzle-orm";
import type { TrainUuid } from "$lib/types/Trains/Train";
import { ConnectionTable } from "../db/schema/connection";

export class Connection {
  public uuid: ConnectionUUID;
  public layoutUuid: LayoutUUID;

  public name: string;
  public protocol: ConnectionProtocol;
  private hardware: HardwareClass;

  public get isConnected(): boolean {
    return this.hardware.isConnected
  };

  constructor(uuid: ConnectionUUID, layoutUuid: LayoutUUID, name: string, protocol: ConnectionProtocol, hardware: HardwareClass) {
    this.uuid = uuid;
    this.layoutUuid = layoutUuid;
    this.name = name;
    this.protocol = protocol;
    this.hardware = hardware;
  }

  public toJsonWeb() {
    return {
      name: this.name,
      layoutUuid: this.layoutUuid,
      protocol: this.protocol,
      uuid: this.uuid,
      hardwareType: this.hardware.connType,
    };
  }

  public toJsonFile() {
    return {
      name: this.name,
      layoutUuid: this.layoutUuid,
      protocol: this.protocol,
      uuid: this.uuid,
      hardware: this.hardware.toJson(),
    };
  }

  public static fromJsonWeb(json: any): Connection | null {
    console.log(json);

    const connUuid = json.uuid;
    const connName = json.name;
    const connProtocol = parseInt(json.protocol);
    const connHardwareType = parseInt(json.hardwareType);
    const connLayoutUuid = json.layoutUuid;

    console.log(!connUuid, !connName, !connProtocol, !connHardwareType, !connLayoutUuid);

    if (connUuid === undefined || connName === undefined || connProtocol === undefined || connHardwareType === undefined || connLayoutUuid || connLayoutUuid === undefined) {
      console.error("Failed to load connection from json web: Undefined uuid, name, protocol, layoutUuid or hardware type");
      return null;
    }

    let hardware: HardwareClass;

    switch (connHardwareType) {
      case ConnectionType.Emulator:
        hardware = new EmulatorConnection();
        break;
      case ConnectionType.Serial:
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

    return new Connection(connUuid, connLayoutUuid, connName, connProtocol, hardware);
  }

  public static fromJsonFile(json: any): Connection | null {
    json = JSON.parse(json);

    const connUuid = json.uuid;
    const connName = json.name;
    const connProtocol = json.protocol;
    const connHardware = json.hardware;
    const connLayoutUuid = json.layoutUuid;


    if (!connUuid || !connName || !connProtocol || !connHardware || !connLayoutUuid) {
      console.error("Failed to load connection from json file: Undefined uuid, name, protocol, layoutUuid or hardware");
      return null;
    }

    let hardware: HardwareClass;

    switch (json.hardware.connType) {
      case ConnectionType.Emulator:
        hardware = new EmulatorConnection();
        break;
      case ConnectionType.Serial:
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

    return new Connection(connUuid, connLayoutUuid, connName, connProtocol, hardware);
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

      this.processCommand(JSON.parse(d));
    });
  }

  private processCommand(command: string) {
    switch (this.protocol) {
      case ConnectionProtocol.DCCEX:
        this.processDccExCommand(command);
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;
    }
  }

  private async processDccExCommand(command: string) {

    if (/<p0>/.test(command)) { // Power Off
      console.log("Power Off");
      return;
    }

    if (/<p1>/.test(command)) { // Power On
      console.log("Power On");
      return;
    }

    const match = command.match(/<l (\d+) (\d+) ([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) (\d+)>/);
    if (match) {
      const cabId = parseInt(match[1]);
      const slot = parseInt(match[2]);
      const speedByte = parseInt(match[3]);
      const functionMap = parseInt(match[4]);

      const { direction, speed, functStates } = DccEx.processCabCommand(cabId, slot, speedByte, functionMap);

      const layout = LayoutServerHandler.getLayout(this.uuid);
      if (!layout) {
        console.log("Layout not found: " + this.uuid);
        return;
      }

      // TODO Add functions states
      const trainUuids = await db.update(TrainTable)
        .set({
          speed: speed,
          direction: direction === 0 ? "Reverse" : "Forward"
        })
        .where(and(eq(TrainTable.address, cabId.toString()), eq(TrainTable.connectionUuid, this.uuid)))
        .returning({
          uuid: TrainTable.uuid,
        });

      functStates.forEach((state, i) => {
        trainUuids.forEach(async uuid => {
          await db.update(TrainFunctionTable)
            .set({
              state
            })
            .where(and(eq(TrainFunctionTable.trainUuid, uuid as unknown as TrainUuid), eq(TrainFunctionTable.value, i.toString())))
        });
      });

      // const train = layout.getTrain(`${this.uuid}:${cabId}`)
      // if (!train) {
      //   console.log("Train not found: " + cabId);
      //   return;
      // }

      // train.speed = speed;
      // train.direction = direction;
      // functStates.forEach((state, i) => {
      //   const trainFunct = train.functions.get(i.toString());

      //   if (trainFunct) {
      //     trainFunct.state = state;
      //   }
      // });

      return;
    }
  }

  public addHardware(hardware: HardwareClass) {
    this.hardware = hardware;
  }


  public static async getConnectionFromDb(connId: ConnectionUUID): Promise<Connection | undefined> {
    const dbConnections = await db.select().from(ConnectionTable).where(eq(ConnectionTable.uuid, connId));
    const dbConn = dbConnections[0];
    if (!dbConn) return;

    let hardware: HardwareClass | undefined = undefined;

    switch (dbConn.hardware) {
      case "Emulator":
        hardware = new EmulatorConnection();
        break;
      case "Serial":
        // if (json.hardware.path == undefined || json.hardware.baudRate == undefined) {
        //   console.log(`Invalid serial connection data`);
        //   return null;
        // }
        // hardware = new SerialConnection(json.hardware.path, json.hardware.baudRate);
        break;
    }

    if (!hardware) return;

    const connection = new Connection(dbConn.uuid as ConnectionUUID, dbConn.layoutUuid as LayoutUUID, dbConn.name, dbConn.protocol, hardware);

    return connection;
  }
}

