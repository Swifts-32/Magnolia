import type { TrainUuid } from "$lib/types/Trains/Train";
import { ClientTrain } from "./Trains/Train.svelte";
import { ClientConnection } from "./Connections/ClientConnection.svelte";
import { SvelteMap } from "svelte/reactivity";
import { SensorClient, type SensorUuid } from "./Sensors/SensorClient.svelte";
import { getContext, onDestroy, setContext } from "svelte";
import { toast } from "svelte-sonner";

export type ConnectionUUID = `${string}-${string}-${string}-${string}-${string}`;
export type LayoutUUID = `${string}-${string}-${string}-${string}-${string}`;

const LAYOUT_CLIENT_KEY = Symbol("LAYOUT_CLIENT");

export function createLayoutClientState(id: LayoutUUID, name: string) {
  return setContext(LAYOUT_CLIENT_KEY, new LayoutClient(name, id));
}

export function getLayoutClientState() {
  return getContext<ReturnType<typeof createLayoutClientState>>(LAYOUT_CLIENT_KEY);
}

export class LayoutClient {
  public name: string = $state() as string;
  public uuid: LayoutUUID = $state() as LayoutUUID;
  private appEventSource: EventSource | null = null;

  public connections: SvelteMap<ConnectionUUID, ClientConnection> = new SvelteMap();
  public trains: SvelteMap<TrainUuid, ClientTrain> = new SvelteMap(); // Map of trains currently being controlled.

  public sensors: SvelteMap<SensorUuid, SensorClient> = new SvelteMap();

  constructor(name: string, uuid: LayoutUUID) {
    this.name = name;
    this.uuid = uuid;

    this.connectToSse();

    onDestroy(() => {
      this.appEventSource?.close();
    })
  }

  private connectToSse() {
    this.appEventSource = new EventSource(`/api/${this.uuid}/stream`);

    this.appEventSource.addEventListener("Update", (event) => {

    });
  }

  public async getTrain(trainId: TrainUuid): Promise<ClientTrain | undefined> {
    if (this.trains.has(trainId)) return this.trains.get(trainId);

    const response = await fetch(`/api/layout/${this.uuid}/trains/${trainId}`, {});
    const json = await response.json();
    if (response.ok) {
      const train = ClientTrain.fromJsonWeb(json.train);

      if (train) {
        this.trains.set(train.uuid, train);
        return train;
      }
      else {
        return undefined;
      }
    } else {
      toast(json.message);
    }
  }

  public deleteTrain(trainId: TrainUuid) {

  }


  public async loadTrain(trainId: TrainUuid): Promise<ClientTrain | undefined> {
    if (this.trains.has(trainId)) return this.trains.get(trainId);

    const response = await fetch(`/api/layout/${this.uuid}/trains/${trainId}`);
    const json = await response.json();
    if (response.ok) {
      const train = ClientTrain.fromJsonWeb(json.train);

      if (train) {
        this.trains.set(train.uuid, train);
        return train;
      }
      else {
        return undefined;
      }
    } else {
      toast(json.message);
    }
  }
  public async loadConnection(connId: ConnectionUUID): Promise<ClientConnection | undefined> {
    if (this.connections.has(connId)) return this.connections.get(connId);

    const response = await fetch(`/api/layout/${this.uuid}/${connId}`);
    const json = await response.json();
    if (response.ok) {
      const connection = ClientConnection.fromJsonWeb(json.connection);

      if (connection) {
        this.connections.set(connection.uuid, connection);
        return connection;
      }
      else {
        return undefined;
      }
    } else {
      toast(json.message);
    }

    return undefined;
  }

  public static fromJsonWeb(json: any): LayoutClient | null {
    const layoutName = json.name;
    const layoutUuid = json.uuid;

    if (!layoutName || !layoutUuid) {
      console.error("Failed to load layout: Undefined name or uuid");
      return null;
    }

    const layout = new LayoutClient(layoutName, layoutUuid);

    layout.loadConnectionsFromJson(json);

    return layout;
  }

  public loadConnectionsFromJson(json: any) {
    const serverConnectionUUIDs = new Set();

    // Add all server connections to the client
    for (const conn of json.connections) {
      if (conn.uuid === undefined) {
        console.log("Invalid connection uuid");
        return;
      }
      else if (conn.name === undefined) {
        console.log("Invalid connection name");
        return;
      }
      else if (conn.protocol === undefined) {
        console.log("Invalid connection protocol");
        return;
      }
      else if (conn.hardware === undefined) {
        console.log("Invalid connection hardware");
        return;
      }
      else if (conn.hardware.connType === undefined) {
        console.log("Invalid connection hardware type");
        return;
      }

      // TODO Maybe update instead of create if it already exists
      if (this.connections.has(conn.uuid)) {
        console.log(`Connection ${conn.name} (${conn.uuid}) already exists on client`);
      }

      serverConnectionUUIDs.add(conn.uuid);

      const connection = new ClientConnection(conn.protocol, conn.hardware.connType, conn.name, conn.uuid, this.uuid);

      this.connections.set(conn.uuid, connection);
    }

    // Remove connections that still exist on client but not on server
    for (const [uuid, connection] of this.connections) {
      if (!serverConnectionUUIDs.has(uuid)) {
        console.log(`Removing connection ${connection.name} (${uuid}) as it no longer exists on server`);
        this.connections.delete(uuid);
      }
    }
  }

}