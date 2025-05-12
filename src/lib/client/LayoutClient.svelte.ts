import { isTrainData, type TrainUUID } from "$lib/types/Trains/Train";
import { ClientTrain } from "./Trains/Train.svelte";
import { ClientConnection } from "./Connections/ClientConnection.svelte";
import { isFunctionData } from "$lib/types/Trains/Functions/Functions";
import { SvelteMap } from "svelte/reactivity";
import type { SensorClient, SensorUuid } from "./Sensors/SensorClient.svelte";

export type ConnectionUUID = `${string}-${string}-${string}-${string}-${string}`;
export type LayoutUUID = `${string}-${string}-${string}-${string}-${string}`;

export class LayoutClient {
  public name: string = $state() as string;
  public uuid: LayoutUUID = $state() as LayoutUUID;

  public connections: SvelteMap<ConnectionUUID, ClientConnection> = new SvelteMap();
  public sensors: SvelteMap<SensorUuid, SensorClient> = new SvelteMap();

  public get trains() {
    let trains: Map<TrainUUID, ClientTrain> = new Map();

    this.connections.forEach(connection => {
      connection.trains.forEach((train, uuid) => {
        trains.set(uuid, train);
      });
    })
    return trains;
  }

  constructor(name: string, uuid: LayoutUUID) {
    this.name = name;
    this.uuid = uuid;
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

      // Add trains to connection
      const serverTrainUuids = new Set();

      for (const train of conn.trains) {
        if (!isTrainData(train)) {
          console.log("Invalid train data");
          continue;
        }

        serverTrainUuids.add(train.uuid);

        const clientTrain = new ClientTrain(train.uuid, train.address, train.name, conn.uuid, this.uuid);

        // Add functions to train
        for (const funct of train.functions) {
          if (!isFunctionData(funct)) {
            console.log("Invalid function data");
            continue;
          }

          clientTrain.addFunction(funct.value, funct.name, funct.icon, funct.mode, funct.position, this.uuid);
        }

        connection.trains.set(clientTrain.uuid, clientTrain);
      }

      // Remove trains that still exist on client but not on server
      for (const [uuid, train] of connection.trains) {
        if (!serverTrainUuids.has(uuid)) {
          console.log(`Removing train ${train.name} (${uuid}) as it no longer exists on server`);
          connection.trains.delete(uuid);
        }
      }

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
    console.log("Layout client, Load Sensors - Not yet implemented");
  }
}