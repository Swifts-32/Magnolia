import type { TrainFunctionUUID } from "$lib/types/Trains/Functions/Functions";
import type { TrainAddress, TrainUUID } from "$lib/types/Trains/Train";
import type { ConnectionUUID, LayoutUUID } from "../LayoutClient.svelte";
import { ConnectionProtocols, ConnectionTypes } from "../Protocols/protocols";
import { TrainDirection, type ClientTrain } from "../Trains/Train.svelte";

export class ClientConnection {
  public protocol: ConnectionProtocols = $state() as ConnectionProtocols;
  public hardware: ConnectionTypes = $state() as ConnectionTypes;
  public name: string = $state() as string;
  public uuid: ConnectionUUID;
  public layoutUUID: LayoutUUID;
  public trains: Map<TrainUUID, ClientTrain> = new Map();


  public isConnected: boolean = $state(false);

  constructor(protocol: ConnectionProtocols, hardware: ConnectionTypes, name: string, uuid: ConnectionUUID, layoutUUID: LayoutUUID) {
    this.protocol = protocol;
    this.hardware = hardware;
    this.name = name;
    this.uuid = uuid;
    this.layoutUUID = layoutUUID;
  }


  processCommand(command: string) {
    switch (this.protocol) {
      case ConnectionProtocols.DCCEX:
        this.processDCCEXCommand(command);
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
          train.speed = speed;
          train.direction = direction;

          // TODO: Implement function states
          // functionStates.forEach(funct => {
          //   train.setFunction(funct.index, funct.state);
          // });
        }
        else {
          console.log("Train not found: " + cab);
        }
      }

    } else {
      console.log("Unknown command: " + command);
    }
  }


  setTrainDirection(trainUUID: TrainUUID, direction: TrainDirection) {
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

  setTrainSpeed(trainUUID: TrainUUID, speed: number) {
    const train = this.trains.get(trainUUID);
    if (train) {
      train.speed = speed;

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

  setTrainFunction(trainUUID: TrainUUID, functionUUID: TrainFunctionUUID, state: boolean) {
    const train = this.trains.get(trainUUID);
    if (!train) return;

    const funct = train.functions.get(functionUUID);
    if (!funct) return
    funct.state = state;

    switch (this.protocol) {
      case ConnectionProtocols.DCCEX:
        fetch(`/api/layout/${this.layoutUUID}/${this.uuid}/write?data=<f ${train.address} ${funct.value} ${state ? 1 : 0}>`);
        break;
      default:
        console.log("Unknown protocol: " + this.protocol);
        break;

    }
  }
}

