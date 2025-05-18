import type { TrainUuid } from "$lib/types/Trains/Train";
import { ClientTrain } from "./Trains/Train.svelte";
import { ClientConnection } from "./Connections/ClientConnection.svelte";
import { SvelteMap } from "svelte/reactivity";
import { SensorClient, type SensorUuid } from "./Sensors/SensorClient.svelte";

export type ConnectionUUID = `${string}-${string}-${string}-${string}-${string}`;
export type LayoutUUID = `${string}-${string}-${string}-${string}-${string}`;

export class LayoutClient {
  public name: string = $state() as string;
  public uuid: LayoutUUID = $state() as LayoutUUID;

  public connections: SvelteMap<ConnectionUUID, ClientConnection> = new SvelteMap();
  public sensors: SvelteMap<SensorUuid, SensorClient> = new SvelteMap();
  public trains: SvelteMap<TrainUuid, ClientTrain> = new SvelteMap();

  constructor(name: string, uuid: LayoutUUID) {
    this.name = name;
    this.uuid = uuid;
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
    layout.loadSensorsFromJson(json);
    layout.loadTrainsFromJsonWeb(json);

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

  public loadSensorsFromJson(json: any) {
    const serverSensorUuids = new Set();

    for (const sensorJson of json.sensors) {
      if (sensorJson.uuid === undefined) {
        console.log("Invalid sensor uuid");
        return;
      }

      // TODO Maybe update instead of create if it already exists

      const sensor = new SensorClient(sensorJson.layoutUUID, sensorJson.uuid);
      sensor.name = sensorJson.name;



      serverSensorUuids.add(sensor.uuid);
      this.sensors.set(sensor.uuid, sensor);
    }

    for (const [uuid, sensor] of this.sensors) {
      if (!serverSensorUuids.has(uuid)) {
        console.log(`Removing senser ${sensor.name} (${uuid}) as it no longer exists on server`);
        this.sensors.delete(uuid);
      }
    }
  }

  public loadTrainsFromJsonWeb(json: any) {
    const serverTrainUuids = new Set();

    for (const trainJson of json.trains) {
      const train = ClientTrain.fromJsonWeb(trainJson);
      if (!train) continue;

      serverTrainUuids.add(train.uuid);
      this.trains.set(train.uuid, train);
    }

    // Remove trains that no longer exist on the server from the client
    this.trains.forEach(train => {
      if (!serverTrainUuids.has(train.uuid)) {
        this.trains.delete(train.uuid);
      }
    })
  }
}