import 'clsx';
import { t as toast } from './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import { a as ConnectionProtocols } from './protocols-BWs_B1An.js';
import { C as ClientTrain, T as TrainDirection } from './Train.svelte-B8RiRVnW.js';

class ClientConnection {
  protocol;
  hardware;
  name;
  uuid;
  layoutUUID;
  trains = /* @__PURE__ */ new Map();
  isConnected = false;
  constructor(protocol, hardware, name, uuid, layoutUUID) {
    this.protocol = protocol;
    this.hardware = hardware;
    this.name = name;
    this.uuid = uuid;
    this.layoutUUID = layoutUUID;
  }
  processCommand(command) {
    switch (this.protocol) {
      case ConnectionProtocols.DCCEX:
        this.processDCCEXCommand(command);
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;
    }
  }
  processDCCEXCommand(command) {
    if (/Cid:[^:]+:\s*<p0>/.test(command)) {
      console.log("Power Off");
      return;
    } else if (/Cid:[^:]+:\s*<p1>/.test(command)) {
      console.log("Power On");
      return;
    } else if (/Cid:[^:]+:\s*<l (\d+) (\d+) (\d|\d{2}|[012][0-5][0-5]) (\d+)>/.test(command)) {
      const match = command.match(/Cid:[^:]+:\s*<l (\d+) (\d+) (\d|\d{2}|[012][0-5][0-5]) (\d+)>/);
      if (match) {
        const cab = parseInt(match[1]);
        parseInt(match[2]);
        const speedByte = parseInt(match[3]);
        const functionMap = parseInt(match[4]);
        let speed;
        let direction;
        if (speedByte === 1) {
          speed = -1;
          direction = TrainDirection.Reverse;
        } else if (speedByte === 129) {
          speed = 0;
          direction = TrainDirection.Reverse;
        } else if (speedByte === 0) {
          speed = 0;
          direction = TrainDirection.Reverse;
        } else if (speedByte === 128) {
          speed = 0;
          direction = TrainDirection.Forward;
        } else if (speedByte >= 2 && speedByte <= 127) {
          speed = speedByte - 1;
          direction = TrainDirection.Reverse;
        } else if (speedByte >= 130 && speedByte <= 255) {
          speed = speedByte - 129;
          direction = TrainDirection.Forward;
        } else {
          return null;
        }
        Array.from({ length: 29 }, (_, i) => ({ index: i, state: (functionMap & 1 << i) !== 0 }));
        let train = this.getTrain(cab);
        if (train) {
          train.speed = speed;
          train.direction = direction;
        }
      }
    } else {
      console.log("Unknown command: " + command);
    }
  }
  setTrainDirection(trainUUID, direction) {
    const train = this.trains.get(trainUUID);
    if (train) {
      train.direction = direction;
      switch (this.protocol) {
        case ConnectionProtocols.DCCEX:
          fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/write?data=<t ${train.address} ${train.speed} ${train.direction}>`);
          break;
        default:
          console.log("Unknown protocol: " + this.protocol);
          break;
      }
    }
  }
  setTrainSpeed(trainUUID, speed) {
    const train = this.trains.get(trainUUID);
    if (train) {
      train.speed = speed;
      switch (this.protocol) {
        case ConnectionProtocols.DCCEX:
          fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/write?data=<t ${train.address} ${train.speed} ${train.direction}>`);
          console.log(`<t ${train.address} ${train.speed} ${train.direction}>`);
          break;
        default:
          console.log("Unknown protocol: " + this.protocol);
          break;
      }
    }
  }
  emergencyStop() {
    switch (this.protocol) {
      case ConnectionProtocols.DCCEX:
        fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/write?data=<!>`);
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;
    }
  }
  getTrain(trainAddress) {
    for (const train of this.trains.values()) {
      if (train.address === trainAddress) {
        return train;
      }
    }
    return void 0;
  }
}
class LayoutClient {
  eventSource = null;
  name;
  uuid;
  connections = /* @__PURE__ */ new Map();
  constructor(name, uuid, trains, connections) {
    this.name = name;
    this.uuid = uuid;
    this.addConnections(connections);
    this.refreshLayout();
  }
  static async create(layoutUUID, fetch2) {
    const layoutData = await fetch2(`/api/layout/${layoutUUID}`).then((res) => res.json().then((data) => {
      return data.message;
    }));
    const connections = await LayoutClient.fetchConnections(layoutUUID, fetch2, /* @__PURE__ */ new Map());
    const trains = await LayoutClient.fetchTrains(layoutUUID, fetch2, /* @__PURE__ */ new Map());
    return new LayoutClient(layoutData.name, layoutUUID, trains, connections);
  }
  createSSE() {
    this.eventSource = new EventSource(`/api/layout/${this.uuid}/stream`);
    this.eventSource.onmessage = (event) => this.handleData(event.data);
    this.eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      this.eventSource?.close();
    };
    console.log(`SSE for ${this.name} is ready to recieve data`);
  }
  // Logs data recieved from the server.
  handleData(data) {
    console.log("SSE Rx: ", data);
    data = data.trim();
    const match = data.match(/^Cid:([^:]+)/);
    if (match) {
      const connUUID = match[1];
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
      } else {
        console.log("Connection does not exist");
      }
    }
  }
  async connect(connUUID) {
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
  async disconnect(connUUID) {
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
  async write(connUUID, data) {
    let connection = this.connections.get(connUUID);
    if (connection) {
      const res = await fetch(`/api/layout/${this.uuid}/${connUUID}/write?data=${data}`);
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message);
      }
    }
  }
  getConnections() {
    return this.connections;
  }
  addConnections(connections) {
    for (const connection of connections.values()) {
      this.connections.set(connection.uuid, connection);
    }
  }
  async refreshLayout() {
    this.connections = await LayoutClient.fetchConnections(this.uuid, fetch, this.connections);
  }
  getTrains() {
    let trains = /* @__PURE__ */ new Map();
    for (const connection of this.connections.values()) {
      for (const train of connection.trains.values()) {
        trains.set(train.uuid, train);
      }
    }
    return trains;
  }
  static async fetchTrains(layoutUUID, fetch2, trains) {
    const trainData = await fetch2(`/api/layout/${layoutUUID}/trains`).then((res) => res.json().then((data) => {
      return data.message;
    }));
    const serverTrains = Array.isArray(trainData) ? trainData : [];
    const serverTrainUUIDs = new Set(serverTrains.map((train) => train.uuid));
    let clientTrains = /* @__PURE__ */ new Map();
    for (const [uuid, train] of trains) {
      if (!serverTrainUUIDs.has(uuid)) {
        console.log(`Removing train ${train.name} (${uuid}) as it no longer exists on server`);
        continue;
      }
      clientTrains.set(uuid, train);
    }
    serverTrains.forEach((trainData2) => {
      if (clientTrains.has(trainData2.uuid)) {
        let clientTrain = clientTrains.get(trainData2.uuid);
        if (clientTrain) {
          clientTrain.address = trainData2.address;
          clientTrain.name = trainData2.name;
          clientTrain.connUUID = trainData2.connUUID;
        }
      } else {
        clientTrains.set(trainData2.uuid, new ClientTrain(trainData2.uuid, trainData2.address, trainData2.name, trainData2.connUUID));
      }
    });
    return clientTrains;
  }
  static async fetchConnections(layoutUUID, fetch2, connections) {
    const connectionData = await fetch2(`/api/layout/${layoutUUID}/connections`).then((res) => res.json().then((data) => {
      return data.message;
    }));
    const serverConnections = Array.isArray(connectionData) ? connectionData : [];
    const serverConnectionUUIDs = new Set(serverConnections.map((conn) => conn.uuid));
    let clientConnections = /* @__PURE__ */ new Map();
    for (const [uuid, connection] of connections) {
      if (!serverConnectionUUIDs.has(uuid)) {
        console.log(`Removing connection ${connection.name} (${uuid}) as it no longer exists on server`);
        continue;
      }
      clientConnections.set(uuid, connection);
    }
    serverConnections.forEach((connData) => {
      if (clientConnections.has(connData.uuid)) {
        let clientConnection = clientConnections.get(connData.uuid);
        if (clientConnection) {
          clientConnection.name = connData.name;
          clientConnection.hardware = connData.hardware.connType;
          const serverTrainUUIDs = new Set(connData.trains.map((train) => train.uuid));
          let clientTrains = /* @__PURE__ */ new Map();
          for (const [uuid, train] of clientConnection.trains) {
            if (!serverTrainUUIDs.has(uuid)) {
              console.log(`Removing train ${train.name} (${uuid}) as it no longer exists on server`);
              continue;
            }
            clientTrains.set(uuid, train);
          }
          connData.trains.forEach((trainData) => {
            if (clientTrains.has(trainData.uuid)) {
              let clientTrain = clientTrains.get(trainData.uuid);
              if (clientTrain) {
                clientTrain.address = trainData.address;
                clientTrain.name = trainData.name;
              }
            } else {
              clientTrains.set(trainData.uuid, new ClientTrain(trainData.uuid, trainData.address, trainData.name, clientConnection.uuid));
            }
          });
          clientConnection.trains = clientTrains;
        }
      } else {
        let connection = void 0;
        switch (connData.protocol) {
          case ConnectionProtocols.DCCEX:
            connection = new ClientConnection(connData.protocol, connData.hardware.connType, connData.name, connData.uuid, layoutUUID);
            break;
          default:
            console.log("Unknown protocol for connection: ", connData.name);
            break;
        }
        if (connection) {
          let clientTrains = /* @__PURE__ */ new Map();
          connData.trains.forEach((trainData) => {
            if (clientTrains.has(trainData.uuid)) {
              let clientTrain = clientTrains.get(trainData.uuid);
              if (clientTrain) {
                clientTrain.address = trainData.address;
                clientTrain.name = trainData.name;
              }
            } else {
              clientTrains.set(trainData.uuid, new ClientTrain(trainData.uuid, trainData.address, trainData.name, connData.uuid));
            }
          });
          connection.trains = clientTrains;
          clientConnections.set(connData.uuid, connection);
        }
      }
    });
    return clientConnections;
  }
  setTrainDirection(connUUID, trainUUID, direction) {
    let connection = this.connections.get(connUUID);
    if (!connection) return;
    connection.setTrainDirection(trainUUID, direction);
  }
  setTrainSpeed(connUUID, trainUUID, speed) {
    let connection = this.connections.get(connUUID);
    if (!connection) return;
    connection.setTrainSpeed(trainUUID, speed);
  }
  getTrain(connUUID, trainUUID) {
    let connection = this.connections.get(connUUID);
    if (!connection) return;
    return connection.trains.get(trainUUID);
  }
}
class LayoutClientHandler {
  layouts = /* @__PURE__ */ new Map();
  async refreshLayouts() {
    const json = await fetch("/api/layout").then((res) => res.json());
    const layouts = json.map(([uuid, config]) => ({ uuid, config }));
    const serverLayoutUUIDs = new Set(layouts.map((layout) => layout.uuid));
    for (const uuid of this.layouts.keys()) {
      if (!serverLayoutUUIDs.has(uuid)) {
        this.layouts.delete(uuid);
      }
    }
    for (const layout of layouts) {
      if (!this.layouts.has(layout.uuid)) {
        const layoutClient = await LayoutClient.create(layout.uuid, fetch);
        this.layouts.set(layout.uuid, layoutClient);
      } else {
        let layoutClient = this.layouts.get(layout.uuid);
        if (!layoutClient) {
          console.log(`Layout client not found for layout ${layout.uuid}`);
          continue;
        }
        await layoutClient.refreshLayout();
      }
    }
  }
}
const layoutClientHandler = new LayoutClientHandler();

export { layoutClientHandler as l };
//# sourceMappingURL=LayoutClientHandler.svelte-BywpuRZh.js.map
