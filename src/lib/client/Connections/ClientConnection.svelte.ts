import type { TrainAddress, TrainUUID } from "$lib/types/Trains/Train";
import { toast } from "svelte-sonner";
import type { ConnectionUUID, LayoutUUID } from "../LayoutClient.svelte";
import { ConnectionProtocols, ConnectionTypes } from "../Protocols/protocols";
import { TrainDirection, type ClientTrain } from "../Trains/Train.svelte";

export class ClientConnection {
  public protocol: ConnectionProtocols = $state() as ConnectionProtocols;
  public hardware: ConnectionTypes = $state() as ConnectionTypes;
  public name: string = $state() as string;
  public uuid: ConnectionUUID;
  public layoutUUID: LayoutUUID;
  public trains: Map<TrainUUID, ClientTrain> = $state(new Map());

  public isConnected: boolean = $state(false);

  constructor(protocol: ConnectionProtocols, hardware: ConnectionTypes, name: string, uuid: ConnectionUUID, layoutUUID: LayoutUUID) {
    this.protocol = protocol;
    this.hardware = hardware;
    this.name = name;
    this.uuid = uuid;
    this.layoutUUID = layoutUUID;
  }

  public async connect() {
    const res = await fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/connect`);
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
    const res = await fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/disconnect`);
    const json = await res.json();

    this.isConnected = false;

    if (res.ok) {
      toast.success(json.message);
    } else {
      toast.error(json.message);
    }
  }

  public async write(data: string) {
    const res = await fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/write?data=${data}`);
    const json = await res.json();

    if (!res.ok) toast.error(json.message);
  }


  processCommand(command: string) {
    switch (this.protocol) {
      case ConnectionProtocols.DCCEX:
        this.processDCCEXCommand(command);
        break;
      case ConnectionProtocols.LCC:
        this.processLCCCommand(command);
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;
    }
  }


  private processDCCEXCommand(command: string) {
    if (/Cid:[^:]+:\s*<p0>/.test(command)) { // Power Off
      console.log("Power Off");
      return;
    } else if (/Cid:[^:]+:\s*<p1>/.test(command)) { // Power On
      console.log("Power On");
      return;
    } else if (/Cid:[^:]+:\s*<l (\d+) (\d+) ([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) (\d+)>/.test(command)) {
      /**
       * <l cab reg speedByte functMap>
       * cab: DCC Address of the decoder/loco.
       * reg: not used. We no longer use this but need something here for compatibility with legacy systems. Enter any single digit.
       * speedbyte: Speed in DCC speedstep format
       *    - reverse - 2-127 = speed 1-126, 0 = stop, 1 = Emergency Stop
       *    - forward - 130-255 = speed 1-126, 128 = stop, 129 = Emergency Stop
       * FunctiMap: individual function states represented by the bits in a byte
       */
      const match = command.match(/Cid:[^:]+:\s*<l (\d+) (\d+) ([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) (\d+)>/);

      if (match) {
        const cab = parseInt(match[1]);  // Loco ID
        const reg = parseInt(match[2]);  // Register (not used but included)
        const speedByte = parseInt(match[3]);  // Encoded Speed Byte
        const functionMap = parseInt(match[4]);  // Function map as a bit mask

        // Decode speed and direction from speedByte
        let speed: number;
        let direction: TrainDirection;

        if (speedByte === 1) {
          speed = -1;  // Emergency Stop (Reverse)
          direction = TrainDirection.Reverse;
        } else if (speedByte === 129) {
          speed = 0;  // Emergency Stop (Forward)
          direction = TrainDirection.Reverse;

        } else if (speedByte === 0) {
          speed = 0;  // Stop (Reverse)
          direction = TrainDirection.Reverse;
        } else if (speedByte === 128) {

          speed = 0;  // Stop (Forward)
          direction = TrainDirection.Forward;

        } else if (speedByte >= 2 && speedByte <= 127) {
          speed = speedByte - 1;  // Reverse Speed
          direction = TrainDirection.Reverse;
        } else if (speedByte >= 130 && speedByte <= 255) {
          speed = speedByte - 129;  // Forward Speed
          direction = TrainDirection.Forward;

        } else {
          return null; // Invalid speedByte
        }

        // Convert functionMap bitmask to an array of 29 function states
        const functionStates = Array.from({ length: 29 }, (_, i) => ({
          index: i,
          state: (functionMap & (1 << i)) !== 0
        }));

        let train = this.getTrain(cab);

        if (train) {
          train.updateSpeedLocal(speed);
          train.updateDirectionLocal(direction);

          // Update function states
          functionStates.forEach(funct => {
            let trainFunct = train.functions.get(funct.index.toString());

            if (trainFunct) {
              trainFunct.updateStateLocal(funct.state);
            }
          });
        }
        else {
          console.log("Train not found: " + cab);
        }
      }
    } else {
      console.log("Unknown command: " + command);
    }
  }

  private processLCCCommand(command: string) {
    // Commonly, LCC messages come in hex or structured forms. Simulate a parsed message.
    try {
      // Example: "LCC:EVT:NNNNNNNNNN" or "LCC:PRODUCER:active:NNNNNNNNNN"
      if (command.startsWith("LCC:EVT:")) {
        const eventId = command.slice(8).trim();
        console.log("Received Event:", eventId);
        this.handleLccEvent(eventId);
      } else if (command.startsWith("LCC:PRODUCER:")) {
        const parts = command.split(":");
        const state = parts[2];
        const eventId = parts[3];
        console.log(`Producer Event: ${eventId}, State: ${state}`);
        this.handleProducerEvent(eventId, state === "active");
      } else if (command.startsWith("LCC:CONSUMER:")) {
        const parts = command.split(":");
        const state = parts[2];
        const eventId = parts[3];
        console.log(`Consumer Event: ${eventId}, State: ${state}`);
        this.handleConsumerEvent(eventId, state === "active");
      } else if (command.startsWith("LCC:NODEID:")) {
        const nodeId = command.slice(11).trim();
        console.log("Discovered Node:", nodeId);
        this.registerNode(nodeId);
      } else {
        console.warn("Unknown LCC Command:", command);
      }
    } catch (e) {
      console.error("Failed to parse LCC command:", command, e);
    }
  }

  private handleLccEvent(eventId: string) {
    // Map eventId to known turnout, sensor, etc.
    // const device = this.lccRegistry.get(eventId);
    // if (device) {
    //   device.trigger(); // or some other action
    // } else {
    //   console.warn("Unknown LCC event ID:", eventId);
    // }
  }

  private handleProducerEvent(eventId: string, active: boolean) {
    // Could trigger track occupancy or signal update, etc.
    console.log(`Producer event ${eventId} is now ${active ? "active" : "inactive"}`);
  }

  private handleConsumerEvent(eventId: string, active: boolean) {
    // Consumers may reflect turnout movement, lights, etc.
    console.log(`Consumer event ${eventId} is now ${active ? "active" : "inactive"}`);
  }

  private registerNode(nodeId: string) {
    // Save or initialize new node on the layout
    // this.lccNodes.set(nodeId, { lastSeen: Date.now() });
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

  getTrain(trainAddress: TrainAddress): ClientTrain | undefined {
    for (const train of this.trains.values()) {
      if (train.address.toString().trim() == trainAddress.toString().trim()) {
        return train;
      }
    }
    return undefined;
  }
}

