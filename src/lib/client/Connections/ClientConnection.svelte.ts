import { toast } from "svelte-sonner";
import type { ConnectionUUID, LayoutUUID } from "../LayoutClient.svelte";
import { ConnectionProtocols, ConnectionTypes } from "../Protocols/protocols";

export class ClientConnection {
  public uuid: ConnectionUUID;
  public name: string = $state() as string;
  public protocol: ConnectionProtocols = $state() as ConnectionProtocols;
  public hardware: ConnectionTypes = $state() as ConnectionTypes;
  public layoutUuid: LayoutUUID;

  public isConnected: boolean = $state(false);

  constructor(protocol: ConnectionProtocols, hardware: ConnectionTypes, name: string, uuid: ConnectionUUID, layoutUUID: LayoutUUID) {
    this.protocol = protocol;
    this.hardware = hardware;
    this.name = name;
    this.uuid = uuid;
    this.layoutUuid = layoutUUID;
  }

  public toJsonWeb(): string {
    return JSON.stringify({
      uuid: this.uuid,
      name: this.name,
      protocol: this.protocol,
      hardwareType: this.hardware,
      layoutUuid: this.layoutUuid,
    })
  }

  public static fromJsonWeb(json: any): ClientConnection | null {
    json = JSON.parse(json);

    const connUuid = json.uuid;
    const connName = json.name;
    const connProtocol = json.protocol;
    const connHardwareType = json.hardwareType;
    const connLayoutUuid = json.layoutUuid;

    if (!connUuid || !connName || !connProtocol || !connHardwareType || !connLayoutUuid) {
      console.error("Failed to load connection from json web: Undefined uuid, name, protocol, layoutUuid or hardware type");
      return null;
    }

    const connection = new ClientConnection(connProtocol, connHardwareType, connName, connUuid, connLayoutUuid);

    return connection;
  }

  public async connect() {
    const res = await fetch(`/api/layout/${this.layoutUuid}/${this.uuid}/connect`);
    const json = await res.json();

    if (res.ok) {
      toast.success(json.message);
      this.isConnected = true;
    } else {
      toast.error(json.message);
      this.isConnected = false;
    }
  }

  public async disconnect() {
    const res = await fetch(`/api/layout/${this.layoutUuid}/${this.uuid}/disconnect`);
    const json = await res.json();

    this.isConnected = false;

    if (res.ok) {
      toast.success(json.message);
    } else {
      toast.error(json.message);
    }
  }

  public async write(data: string) {
    const res = await fetch(`/api/layout/${this.layoutUuid}/${this.uuid}/write?data=${data}`);
    const json = await res.json();

    if (!res.ok) toast.error(json.message);
  }

  public emergencyStop() {
    switch (this.protocol) {
      case ConnectionProtocols.DCCEX:
        this.write("<!>");
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;
    }
  }
}

