import 'clsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SerialPort, ReadlineParser } from 'serialport';
import { C as ConnectionTypes } from './protocols-BWs_B1An.js';
import { createRequire } from 'module';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';

const require2 = createRequire(import.meta.url);
const { autoDetect } = require2("@serialport/bindings-cpp");
class SerialConnection {
  serialPort = null;
  path;
  baudRate;
  connType = ConnectionTypes.Serial;
  dataReceived = null;
  onDataReceived(callback) {
    this.dataReceived = callback;
  }
  get isConnected() {
    return this.serialPort?.isOpen ?? false;
  }
  constructor(path, baudRate) {
    this.path = path;
    this.baudRate = baudRate;
  }
  async connect() {
    return new Promise((resolve, reject) => {
      this.serialPort = new SerialPort({
        binding: autoDetect(),
        path: this.path,
        baudRate: this.baudRate,
        autoOpen: false
      });
      const parser = new ReadlineParser();
      this.serialPort.pipe(parser);
      parser.on("data", (data) => {
        if (this.dataReceived) {
          this.dataReceived(data);
        }
      });
      this.serialPort.open((err) => {
        if (err) {
          reject(`Failed to open port on ${this.path}: ${err.message}`);
        }
        resolve(`Successfully opened port on ${this.path}`);
      });
    });
  }
  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.serialPort) {
        this.serialPort.close((err) => {
          if (err) {
            reject(err.message);
          }
          resolve(`Successfully closed port on ${this.path}`);
        });
      } else {
        reject("Serial port does not exist");
      }
    });
  }
  write(data) {
    if (this.serialPort?.isOpen) {
      console.log("Serial Tx: ", data);
      this.serialPort.write(data, (err) => {
        if (err) {
          console.log("Write error: ", err.message);
        }
      });
    } else {
      console.log("Port is not open. Connecting...");
      this.connect();
    }
  }
  toJSON() {
    return {
      path: this.path,
      baudRate: this.baudRate,
      connType: this.connType
    };
  }
}
class ServerTrainFunctions {
  id;
  icon;
  mode;
  visible = true;
  constructor(id, icon, mode) {
    this.id = id;
    this.mode = mode;
    this.icon = icon;
  }
  toJSON() {
    return {
      id: this.id,
      icon: this.icon,
      mode: this.mode,
      visible: this.visible
    };
  }
}
class ServerTrain {
  uuid;
  connUUID;
  address;
  name;
  functions = /* @__PURE__ */ new Map();
  constructor(address, name, connUUID, uuid = void 0) {
    this.address = address;
    this.name = name;
    this.uuid = uuid ?? crypto.randomUUID();
    this.connUUID = connUUID;
  }
  toJSON() {
    return {
      uuid: this.uuid,
      connUUID: this.connUUID,
      address: this.address,
      name: this.name,
      functions: Array.from(this.functions.entries()).map(([id, funct]) => funct.toJSON())
    };
  }
  static fromJSON(json) {
    if (json.uuid == void 0 || json.connUUID == void 0 || json.address == void 0 || json.name == void 0) {
      console.log(`Invalid train data`);
      return null;
    }
    return new ServerTrain(json.address, json.name, json.connUUID, json.uuid);
  }
  addFunction(id, icon, mode) {
    this.functions.set(id, new ServerTrainFunctions(id, icon, mode));
  }
}
class EmulatorConnection {
  isConnected = false;
  connType = ConnectionTypes.Emulator;
  dataReceived = null;
  onDataReceived(callback) {
    this.dataReceived = callback;
  }
  connect() {
    this.isConnected = true;
    return Promise.resolve("Connected to Emulator");
  }
  disconnect() {
    this.isConnected = false;
    return Promise.resolve("Disconnected from Emulator");
  }
  write(command) {
    if (this.dataReceived) {
      command = command.trim();
      switch (true) {
        case /^<0>$/.test(command):
          this.dataReceived("<p0>");
          break;
        case /^<1>$/.test(command):
          this.dataReceived("<p1>");
          break;
        case /^<t (\d+) (-1|\d|\d{2}|1[012][0-9]) ([01])>$/.test(command): {
          const match = command.match(/^<t (\d+) (-1|\d|\d{2}|1[012][0-9]) ([01])>$/);
          if (match) {
            const cab = parseInt(match[1]);
            const speed = parseInt(match[2]);
            const direction = parseInt(match[3]);
            let speedByte = 0;
            if (speed === -1) {
              speedByte = direction === 1 ? 129 : 1;
            } else if (speed === 0) {
              speedByte = direction === 1 ? 128 : 0;
            } else {
              speedByte = direction === 1 ? 130 + speed - 1 : 2 + speed - 1;
            }
            const functionMap = 0;
            this.dataReceived(`<l ${cab} 0 ${speedByte} ${functionMap}>`);
          }
          break;
        }
        case /<F (\d+) (\d|[0-6][0-8]) ([01])>/.test(command): {
          const match = command.match(/<F (\d+) (\d|[0-6][0-8]) ([01])>/);
          if (match) {
            const cab = match[1];
            const functionID = match[2];
            const state = match[3];
            this.dataReceived(`<F ${cab} ${functionID} ${state}>`);
          }
          break;
        }
        case /^<q>$/.test(command):
          this.dataReceived("<p1>");
          break;
        case /^<L>$/.test(command):
          this.dataReceived("<l 3 0 50 0>");
          break;
        case /^<s>$/.test(command):
          this.dataReceived("<s DCC-EX 5.1 READY>");
          break;
        default:
          this.dataReceived("<X Unknown Command>");
          break;
      }
    }
  }
  toJSON() {
    return {
      connType: this.connType
    };
  }
}
class Connection {
  name;
  protocol;
  uuid;
  hardware;
  trains = /* @__PURE__ */ new Map();
  constructor(connection, name, protocol, uuid, trains = /* @__PURE__ */ new Map()) {
    this.hardware = connection;
    this.name = name;
    this.protocol = protocol;
    this.uuid = uuid;
    this.trains = trains;
  }
  toJSON() {
    return {
      name: this.name,
      protocol: this.protocol,
      uuid: this.uuid,
      hardware: this.hardware.toJSON(),
      trains: Array.from(this.trains.values()).map((train) => train.toJSON())
    };
  }
  static fromJSON(json) {
    if (json.uuid == void 0 || json.name == void 0 || json.protocol == void 0 || json.hardware.connType == void 0) {
      console.log(`Invalid connection data`);
      return null;
    }
    let hardware;
    switch (json.hardware.connType) {
      case ConnectionTypes.Emulator:
        hardware = new EmulatorConnection();
        break;
      case ConnectionTypes.Serial:
        if (json.hardware.path == void 0 || json.hardware.baudRate == void 0) {
          console.log(`Invalid serial connection data`);
          return null;
        }
        hardware = new SerialConnection(json.hardware.path, json.hardware.baudRate);
        break;
      default:
        console.log(`Unknown hardware type: ${json.hardware.connType}`);
        return null;
    }
    let trains = /* @__PURE__ */ new Map();
    for (const trainData of json.trains) {
      let train = ServerTrain.fromJSON(trainData);
      if (train) {
        trains.set(train.uuid, train);
      }
    }
    return new Connection(hardware, json.name, json.protocol, json.uuid, trains);
  }
  async connect() {
    return await this.hardware.connect();
  }
  async disconnect() {
    return await this.hardware.disconnect();
  }
  write(data) {
    this.hardware.write(data);
  }
}
class Layout {
  name;
  uuid;
  position = 0;
  connections = /* @__PURE__ */ new Map();
  controllers = /* @__PURE__ */ new Set();
  constructor(name, uuid) {
    this.name = name;
    this.uuid = uuid;
  }
  toJSON() {
    return {
      name: this.name,
      uuid: this.uuid,
      position: this.position,
      connections: Array.from(this.connections.values()).map((conn) => conn.toJSON())
    };
  }
  static fromJSON(json) {
    if (json.uuid == void 0 || json.name == void 0 || json.position == void 0) {
      console.log(`Invalid layout data, ${json.uuid} ${json.name} ${json.position}`);
      return null;
    }
    const layout = new Layout(json.name, json.uuid);
    layout.position = json.position;
    for (const conn of json.connections) {
      const connection = Connection.fromJSON(conn);
      if (connection) {
        layout.createConnection(connection);
      }
    }
    return layout;
  }
  createStream() {
    let streamController;
    console.log("Creating stream");
    return new ReadableStream({
      start: (controller) => {
        streamController = controller;
        this.controllers.add(controller);
        controller.enqueue("Connected\n");
      },
      cancel: (reason) => {
        this.controllers.delete(streamController);
      }
    });
  }
  addTrain(address, trainName, connUUID, trainUUID = void 0) {
    const connection = this.connections.get(connUUID);
    if (connection) {
      const train = new ServerTrain(address, trainName, connUUID, trainUUID);
      connection.trains.set(train.uuid, train);
      return train;
    }
  }
  /**
   * Creates a DCC serial connection
   * @param path 
   * @param baudRate 
   */
  createSerialConnection(protocol, path, baudRate, connName) {
    const hardware = new SerialConnection(path, baudRate);
    const connUUID = crypto.randomUUID();
    hardware.onDataReceived((data) => {
      const message = `data: Cid:${connUUID}: ${data}

`;
      this.controllers.forEach((controller) => controller.enqueue(message));
    });
    const connection = new Connection(hardware, connName, protocol, connUUID);
    this.connections.set(connUUID, connection);
    return connection;
  }
  /**
   * Creates an emulated DCC EX connection
   */
  createEmulatorConnection(protocol, connName) {
    const hardware = new EmulatorConnection();
    const connUUID = crypto.randomUUID();
    hardware.onDataReceived((data) => {
      const message = `data: Cid:${connUUID}: ${data}

`;
      this.controllers.forEach((controller) => controller.enqueue(message));
    });
    const connection = new Connection(hardware, connName, protocol, connUUID);
    this.connections.set(connUUID, connection);
    return connection;
  }
  createConnection(connection) {
    connection.hardware.onDataReceived((data) => {
      const message = `data: Cid:${connection.uuid}: ${data}

`;
      this.controllers.forEach((controller) => controller.enqueue(message));
    });
    this.connections.set(connection.uuid, connection);
    return connection;
  }
  getTrain(trainUUID) {
    for (const connection of this.connections.values()) {
      const train = connection.trains.get(trainUUID);
      if (train) {
        return train;
      }
    }
  }
}
const __filename = fileURLToPath(import.meta.url);
dirname(__filename);
class LayoutServerHandlerClass {
  layouts = /* @__PURE__ */ new Map();
  static LAYOUTS_DIR = join(process.cwd(), `data/layouts`);
  saveInterval;
  constructor() {
    this.loadSavedLayouts();
    this.saveInterval = setInterval(
      () => {
        this.saveLayouts();
      },
      5 * (60 * 1e3)
    );
  }
  shutdown() {
    this.saveLayouts();
    clearInterval(this.saveInterval);
    console.log("Shutting down LayoutServerHandler");
  }
  addNewLayout(name) {
    const layoutUUID = crypto.randomUUID();
    let layout = new Layout(name, layoutUUID);
    this.layouts.set(layoutUUID, layout);
    this.saveLayouts();
    return layout;
  }
  saveLayouts() {
    if (!existsSync(LayoutServerHandlerClass.LAYOUTS_DIR)) {
      mkdirSync(LayoutServerHandlerClass.LAYOUTS_DIR, { recursive: true });
    }
    const layoutsData = Array.from(this.layouts.values()).map((layout) => layout.toJSON());
    const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, "layouts.json");
    writeFileSync(filePath, JSON.stringify(layoutsData, null, 2));
    console.log(`Saved ${this.layouts.size} layouts`);
  }
  loadSavedLayouts() {
    const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, "layouts.json");
    if (!existsSync(filePath)) {
      return;
    }
    try {
      const layoutsData = JSON.parse(readFileSync(filePath, "utf-8"));
      for (const layoutData of layoutsData) {
        const layout = Layout.fromJSON(layoutData);
        if (layout) {
          this.layouts.set(layout.uuid, layout);
        }
      }
      console.log(`Loaded ${this.layouts.size} layouts`);
    } catch (error) {
      console.log("Error loading layouts:", error);
    }
  }
}
const LayoutServerHandler = new LayoutServerHandlerClass();

export { EmulatorConnection as E, LayoutServerHandler as L, SerialConnection as S };
//# sourceMappingURL=layoutHandler.server.svelte-CPQsJ-Rr.js.map
