import type { HardwareClass } from "./Hardware/hardware";
import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";
import { ConnectionProtocols, ConnectionTypes } from "$lib/client/Protocols/protocols";
import { EmulatorConnection } from "./Hardware/Emulator/Emulator.server";
import { SerialConnection } from "./Hardware/Serial/SerialConnection.server";
import { DccEx } from "../Protocols/DccEx/DccEx";
import { LayoutServerHandler } from "../layoutHandler.server.svelte";

export class Connection {
  public uuid: ConnectionUUID;
  public name: string;
  public protocol: ConnectionProtocols;
  private hardware: HardwareClass;

  public get isConnected(): boolean {
    return this.hardware.isConnected
  };

  constructor(uuid: ConnectionUUID, name: string, protocol: ConnectionProtocols, hardware: HardwareClass) {
    this.uuid = uuid;
    this.name = name;
    this.protocol = protocol;
    this.hardware = hardware;
  }

  toJSON() {
    return {
      name: this.name,
      protocol: this.protocol,
      uuid: this.uuid,
      hardware: this.hardware.toJson(),
      isConnected: this.isConnected,
    };
  }

  public static fromJsonWeb(json: any): Connection | null {
    json = JSON.parse(json);

    const connUuid = json.uuid;
    const connName = json.name;
    const connProtocol = json.protocol;
    const connHardwareJson = json.hardware;

    if (!connUuid || !connName || !connProtocol || !connHardwareJson) {
      console.error("Failed to load connection from json: Undefined uuid, name, protocol or hardware json");
      return null;
    }

    let hardware: HardwareClass;

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

    return new Connection(connUuid, connName, connProtocol, hardware);
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
      case ConnectionProtocols.DCCEX:
        this.processDccExCommand(command);
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;
    }
  }

  private processDccExCommand(command: string) {
    if (/<p0>/.test(command)) { // Power Off
      console.log("Power Off");
      return;
    } else if (/<p1>/.test(command)) { // Power On
      console.log("Power On");
      return;
    } else if (/<l (\d+) (\d+) ([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) (\d+)>/.test(command)) {
      const match = command.match(/<l (\d+) (\d+) ([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) (\d+)>/);
      if (!match) {
        console.log("Invalid command: " + command);
        return;
      }

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

      const train = layout.getTrain(`${this.uuid}:${cabId}`)
      if (!train) {
        console.log("Train not found: " + cabId);
        return;
      }

      train.speed = speed;
      train.direction = direction;
      functStates.forEach((state, i) => {
        const trainFunct = train.functions.get(i.toString());

        if (trainFunct) {
          trainFunct.state = state;
        }
      });
    }
  }

  public addHardware(hardware: HardwareClass) {
    this.hardware = hardware;
  }
}

