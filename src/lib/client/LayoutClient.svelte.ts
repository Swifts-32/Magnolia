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

    this.refreshLayout();
  }



  static async create(layoutUUID: LayoutUUID, fetch: typeof globalThis.fetch): Promise<LayoutClient> {
    // let connections: Map<ConnectionUUID, Connections> = await LayoutClient.fetchLayoutConnections(layoutUUID, fetch);

    // Fetch layout data
    const layoutData = await fetch(`/api/layout/${layoutUUID}`).then(res => res.json().then(data => {
      return data.message;
    }));

    // // TODO: Add functions to the trains
    // const serverTrains: {
    //   uuid: TrainUUID,
    //   connUUID: ConnectionUUID,
    //   address: TrainAddress,
    //   name: string,
    // }[] = Array.isArray(layoutData.trains) ? layoutData.trains : [];

    // let trains: Map<TrainUUID, ClientTrain> = new Map();
    // serverTrains.forEach(train => {
    //   trains.set(train.uuid, new ClientTrain(train.uuid, train.address, train.name, train.connUUID));
    // });

    // console.log(`Loaded ${trains.size} trains`);
    const connections = await LayoutClient.fetchConnections(layoutUUID, fetch, new Map());
    const trains = await LayoutClient.fetchTrains(layoutUUID, fetch, new Map());

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

  public async refreshLayout() {
    this.trains = await LayoutClient.fetchTrains(this.uuid, fetch, this.trains);
    this.connections = await LayoutClient.fetchConnections(this.uuid, fetch, this.connections);
  }



  private static async fetchTrains(layoutUUID: LayoutUUID, fetch: typeof globalThis.fetch, trains: Map<TrainUUID, ClientTrain>) {
    const trainData = await fetch(`/api/layout/${layoutUUID}/trains`).then(res => res.json().then(data => {
      return data.message;
    }));

    const serverTrains: {
      uuid: TrainUUID,
      connUUID: ConnectionUUID,
      address: TrainAddress,
      name: string,
    }[] = Array.isArray(trainData) ? trainData : [];


    // Get all server train UUIDs for comparison
    const serverTrainUUIDs = new Set(serverTrains.map(train => train.uuid));
    let clientTrains: Map<TrainUUID, ClientTrain> = new Map();

    // Remove trains that exist on client but not on server
    for (const [uuid, train] of trains) {
      if (!serverTrainUUIDs.has(uuid)) {
        console.log(`Removing train ${train.name} (${uuid}) as it no longer exists on server`);
        continue;
      }
      clientTrains.set(uuid, train);
    }


    serverTrains.forEach(trainData => {
      if (clientTrains.has(trainData.uuid)) {
        // Train exists, update it
        let clientTrain = clientTrains.get(trainData.uuid);
        if (clientTrain) {
          clientTrain.address = trainData.address;
          clientTrain.name = trainData.name;
          clientTrain.connUUID = trainData.connUUID;
          // TODO Add functions to the train
        }
      }
      else {
        // Train does not exist, create it
        trains.set(trainData.uuid, new ClientTrain(trainData.uuid, trainData.address, trainData.name, trainData.connUUID));
      }
    });

    return clientTrains;
  }

  private static async fetchConnections(layoutUUID: LayoutUUID, fetch: typeof globalThis.fetch, connections: Map<ConnectionUUID, Connections>) {
    // Fetch connection data
    const connectionData = await fetch(`/api/layout/${layoutUUID}/connections`).then(res => res.json().then(data => {
      return data.message;

    }));

    const serverConnections: {
      name: string,
      protocol: ConnectionProtocols,
      uuid: ConnectionUUID,
      hardware: {
        connType: ConnectionTypes,
      },
    }[] = Array.isArray(connectionData) ? connectionData : [];

    // Get all server connection UUIDs for comparison
    const serverConnectionUUIDs = new Set(serverConnections.map(conn => conn.uuid));
    let clientConnections: Map<ConnectionUUID, Connections> = new Map();

    // Remove connections that exist on client but not on server
    for (const [uuid, connection] of connections) {
      if (!serverConnectionUUIDs.has(uuid)) {
        console.log(`Removing connection ${connection.connName} (${uuid}) as it no longer exists on server`);
        continue;
      }
      clientConnections.set(uuid, connection);
    }


    serverConnections.forEach(connData => {
      if (clientConnections.has(connData.uuid)) {
        // Connection exists, update it
        let clientConnection = clientConnections.get(connData.uuid);
        if (clientConnection) {

          clientConnection.connName = connData.name;
          clientConnection.connType = connData.hardware.connType;

          // TODO: Update the connection protocol
        }

      }
      else {
        // Connection does not exist, create it
        switch (connData.protocol) {
          case ConnectionProtocols.DCCEX:
            const connection = new DccEx(layoutUUID, connData.uuid, connData.name, connData.hardware.connType);
            clientConnections.set(connData.uuid, connection);
            break;


          default:
            console.log("Unknown protocol for connection: ", connData.name);
            break;
        }
      }
    });

    return clientConnections;
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