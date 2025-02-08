import { toast } from "svelte-sonner";
import { DccEx } from "./Protocols/DccEx/DccEx.svelte";
import { ConnectionProtocols, ConnectionTypes } from "./Protocols/protocols";
import type { TrainAddress, TrainUUID } from "$lib/server/Trains/Train.server";
import { ClientTrain, TrainDirection } from "./Trains/Train.svelte";

export type Connections = DccEx;
export type ConnectionUUID = `${string}-${string}-${string}-${string}-${string}`;
export type LayoutUUID = `${string}-${string}-${string}-${string}-${string}`;

export class LayoutClient {

  eventSource: EventSource | null = null;
  public name: string = $state() as string;
  public uuid: LayoutUUID = $state() as LayoutUUID;
  public connections: Map<ConnectionUUID, Connections> = $state(new Map());
  public trains: Map<TrainUUID, ClientTrain> = $state(new Map());


  private constructor(name: string, uuid: LayoutUUID, trains: Map<TrainUUID, ClientTrain>, connections: Map<ConnectionUUID, Connections>) {
    this.name = name;
    this.uuid = uuid;

    this.addConnections(connections);
    this.addTrains(trains);
  }



  static async create(layoutUUID: LayoutUUID, fetch: typeof globalThis.fetch): Promise<LayoutClient> {
    let connections: Map<ConnectionUUID, Connections> = await LayoutClient.fetchLayoutConnections(layoutUUID, fetch);

    // Fetch layout data
    const layoutData = await fetch(`/api/layout/${layoutUUID}`).then(res => res.json().then(data => {
      return data.message;
    }));

    // TODO: Add functions to the trains
    const serverTrains: {
      uuid: TrainUUID,
      connUUID: ConnectionUUID,
      address: TrainAddress,
      name: string,
    }[] = Array.isArray(layoutData.trains) ? layoutData.trains : [];

    let trains: Map<TrainUUID, ClientTrain> = new Map();
    serverTrains.forEach(train => {
      trains.set(train.uuid, new ClientTrain(train.uuid, train.address, train.name, train.connUUID));
    });

    console.log(`Loaded ${trains.size} trains`);

    return new LayoutClient(layoutData.name, layoutUUID, trains, connections);

  }

  private static async fetchLayoutConnections(layoutUUID: LayoutUUID, fetch: typeof globalThis.fetch): Promise<Map<ConnectionUUID, Connections>> {
    const res = await fetch(`/api/layout/${layoutUUID}/connections`);
    const json = await res.json();

    const serverConnections: {
      name: string,
      protocol: ConnectionProtocols,
      uuid: ConnectionUUID,
      hardware: {
        connType: ConnectionTypes,
      },
    }[] = Array.isArray(json.message) ? json.message : [];

    let connections: Map<ConnectionUUID, Connections> = new Map();

    serverConnections.forEach(serverData => {
      switch (serverData.protocol) {
        case ConnectionProtocols.DCCEX:
          const connection = new DccEx(layoutUUID, serverData.uuid, serverData.name, serverData.hardware.connType);
          connections.set(serverData.uuid, connection);
          break;

        default:
          console.log("Unknown protocol for connection: ", serverData.name);
          break;
      }
    });

    return connections;
  }

  createSSE() {
    this.eventSource = new EventSource(`/api/layout/${this.uuid}/stream`);


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
      const res = await fetch(`/api/layout/${this.uuid}/${connUUID}/connect`);
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

      const res = await fetch(`/api/layout/${this.uuid}/${connUUID}/disconnect`);
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
      const res = await fetch(`/api/layout/${this.uuid}/${connUUID}/write?data=${data}`);
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message);
      }
    }
  }


  getConnections(): Map<ConnectionUUID, Connections> {
    return this.connections;
  }

  public addTrains(trains: Map<TrainUUID, ClientTrain>) {
    for (const train of trains.values()) {
      this.trains.set(train.uuid, train);
    }
  }
  public addConnections(connections: Map<ConnectionUUID, Connections>) {
    for (const connection of connections.values()) {
      this.connections.set(connection.connUUID, connection);
    }
  }

  public async fetchTrains() {
    // Fetch layout data
    const layoutData = await fetch(`/api/layout/${this.uuid}`).then(res => res.json().then(data => {
      return data.message;

    }));

    const serverTrains: {
      uuid: TrainUUID,
      connUUID: ConnectionUUID,
      address: TrainAddress,
      name: string,
    }[] = Array.isArray(layoutData.trains) ? layoutData.trains : [];


    let trains: Map<TrainUUID, ClientTrain> = new Map();

    serverTrains.forEach(trainData => {
      // TODO Remove trains on client that are not in the server
      if (this.trains.has(trainData.uuid)) {
        // Train exists, update it
        let clientTrain = this.trains.get(trainData.uuid);
        if (clientTrain) {
          clientTrain.address = trainData.address;
          clientTrain.name = trainData.name;
          clientTrain.connUUID = trainData.connUUID;

          // TODO Add functions to the train

          trains.set(trainData.uuid, clientTrain);
        }
      }
      else {
        // Train does not exist, create it
        trains.set(trainData.uuid, new ClientTrain(trainData.uuid, trainData.address, trainData.name, trainData.connUUID));
      }
    });

    this.trains = trains;
  }



  public setTrainDirection(trainUUID: TrainUUID, direction: TrainDirection) {
    let train = this.trains.get(trainUUID);
    if (!train) return;
    
    let connection = this.connections.get(train.connUUID);
    if (!connection) return;
    
    train.direction = direction;
    connection.setDirection(train);
  }

  public setTrainSpeed(trainUUID: TrainUUID, speed: number) {
    let train = this.trains.get(trainUUID);
    if (!train) return;

    let connection = this.connections.get(train.connUUID);
    if (!connection) return;

    train.speed = speed;
    connection.setSpeed(train);
  }

  public getTrain(address: TrainAddress, connUUID: ConnectionUUID): ClientTrain | undefined {
    for (const train of this.trains.values()) {
      if (train.address === address && train.connUUID === connUUID) {
        return train;
      }
    }
    return undefined;
  }

}




export let LayoutC: LayoutClient | null = null;