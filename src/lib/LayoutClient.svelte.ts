import { toast } from "svelte-sonner";
import { DccEx } from "./client/Protocols/DccEx/DccEx.svelte";
import { ConnectionProtocols } from "./client/Protocols/protocols";
import type { Train } from "../services/train.svelte";

export type Connections = DccEx;
export type ConnectionUUID = `${string}-${string}-${string}-${string}-${string}`;
export type LayoutUUID = string;

export class LayoutClient {

  eventSource: EventSource | null = null;
  public name: LayoutUUID;
  public connections: Map<ConnectionUUID, Connections> = new Map();

  private constructor(name: string, connections: Map<ConnectionUUID, Connections>) {
    this.name = name;
    this.connections = connections;
  }

  static async create(name: string, fetch: typeof globalThis.fetch): Promise<LayoutClient> {
    const res = await fetch(`/api/layout/${name}/connections`);
    const json = await res.json();

    const serverConnections: { key: ConnectionUUID, protocol: ConnectionProtocols, connName: string }[] = Array.isArray(json.message) ? json.message : [];

    let connections: Map<ConnectionUUID, Connections> = new Map();

    serverConnections.forEach((e) => {
      let conn: Connections | null = null;

      switch (e.protocol) {
        case ConnectionProtocols.DCCEX:
          conn = new DccEx(name, e.key, e.connName);
          break;
        case ConnectionProtocols.LCC:
          console.log("No LCC connection availvle");
          break;
        default:
          break;
      }

      if (conn) {
        connections.set(e.key, conn);
      }

    });

    return new LayoutClient(name, connections);
  }


  createSSE() {
    this.eventSource = new EventSource(`/api/layout/${this.name}`);
    
    this.eventSource.onmessage = (event) => this.handleData(event.data);
    
    this.eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      this.eventSource?.close();
    }
    
    console.log(`SSE for ${this.name} is ready to recieve data`);
  }

  // Logs data recieved from the server.
  private handleData(data: string) {
    console.log("SSE Rx: ", data);

    data = data.trim();
    const match = data.match(/^Cid:([^:]+)/);

    if (match) {
      const connUUID: ConnectionUUID = match[1] as ConnectionUUID;
      let connection = this.connections.get(connUUID);

      if (connection) {
        switch (connection.protocol) {
          case ConnectionProtocols.DCCEX:
            connection.processCommand(data);
            break;
          case ConnectionProtocols.LCC:
            console.log("LCC protocol is not defined yet");
            break;

          default:
            console.log("Protocol is not defined yet");
            break;
        }
      }
      else {
        console.log("Connection does not exist");
      }

    }
  }

  async connect(connUUID: ConnectionUUID) {
    let connection = this.connections.get(connUUID);

    if (connection) {
      const res = await fetch(`/api/layout/${this.name}/${connUUID}/connect`);
      const json = await res.json();

      if (res.ok) {
        toast.success(json.message);
        connection.isConnected = true;
      } else {
        toast.error(json.message);
        connection.isConnected = false;
      }
    }
  }


  async disconnect(connUUID: ConnectionUUID) {
    let connection = this.connections.get(connUUID);

    if (connection) {

      const res = await fetch(`/api/layout/${this.name}/${connUUID}/disconnect`);
      const json = await res.json();

      connection.isConnected = false;

      if (res.ok) {
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    }
  }


  async write(connUUID: ConnectionUUID, data: string) {
    let connection = this.connections.get(connUUID);

    if (connection) {
      const res = await fetch(`/api/layout/${this.name}/${connUUID}/write?data=${data}`);
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message);
      }
    }
  }

  getTrains(): Train[] {
    const trainList: Train[] = [];
    
    for (const connection of this.connections.values()) {
      if (connection.trains) {
        trainList.push(...Array.from(connection.trains.values()));
      }
    }

    return trainList;
  }

  getConnections(): Map<ConnectionUUID, Connections> {
    return this.connections;
  }
  
}


export let LayoutC: LayoutClient | null = null;