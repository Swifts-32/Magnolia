import type { ConnectionUUID } from "$lib/LayoutClient.svelte";
import { Direction } from "../../../../routes/(app)/layouts/[id]/throttle/throttle";
import { Train } from "../../../../services/train.svelte";
import { ConnectionProtocols, type IProtocol } from "../protocols";

export class DccEx implements IProtocol {
  public isConnected: boolean = $state(false);
  public connName: string;
  public powerStatus: boolean = $state(false);
  public protocol: ConnectionProtocols = ConnectionProtocols.DCCEX;
  public trains: Map<number, Train> = new Map();
  public version: string | undefined = undefined;
  private layoutName: string;
  private connUUID: ConnectionUUID;

  constructor(layoutName: string, connUUID: ConnectionUUID, connName: string) {
    this.layoutName = layoutName;
    this.connUUID = connUUID;
    this.connName = connName;
  }


  processCommand(command: string) {

    switch (true) {
      case /<p0>/.test(command): // Power Off
        this.powerStatus = false;
        break;
      case /<p1>/.test(command): // Power On
        this.powerStatus = true;
        break;

      /**
       * <l cab reg speedByte functMap>
       * cab: DCC Address of the decoder/loco.
       * reg: not used. We no longer use this but need something here for compatibility with legacy systems. Enter any single digit.
       * speedbyte: Speed in DCC speedstep format
       *    - reverse - 2-127 = speed 1-126, 0 = stop, 1 = Emergency Stop
       *    - forward - 130-255 = speed 1-126, 128 = stop, 129 = Emergency Stop
       * FunctiMap: individual function states represented by the bits in a byte
       */
      case /<l (\d+) (\d+) (\d|\d{2}|[012][0-5][0-5]) (\d+)>/.test(command): {
        const match = command.match(/<l (\d+) (\d+) (\d|\d{2}|[012][0-5][0-5]) (\d+)>/);

        if (match) {
          const cab = parseInt(match[1]);  // Loco ID
          const reg = parseInt(match[2]);  // Register (not used but included)
          const speedByte = parseInt(match[3]);  // Encoded Speed Byte
          const functionMap = parseInt(match[4]);  // Function map as a bit mask

          // Decode speed and direction from speedByte
          let speed: number;
          let direction: Direction;

          if (speedByte === 1) {
            speed = -1;  // Emergency Stop (Reverse)
            direction = Direction.reverse;
          } else if (speedByte === 129) {
            speed = 0;  // Emergency Stop (Forward)
            direction = Direction.forward;
          } else if (speedByte === 0) {
            speed = 0;  // Stop (Reverse)
            direction = Direction.reverse;
          } else if (speedByte === 128) {
            speed = 0;  // Stop (Forward)
            direction = Direction.forward;
          } else if (speedByte >= 2 && speedByte <= 127) {
            speed = speedByte - 1;  // Reverse Speed
            direction = Direction.reverse;
          } else if (speedByte >= 130 && speedByte <= 255) {
            speed = speedByte - 129;  // Forward Speed
            direction = Direction.forward;
          } else {
            return null; // Invalid speedByte
          }

          // Convert functionMap bitmask to an array of 29 function states
          const functionStates = Array.from({ length: 29 }, (_, i) => ({
            index: i,
            state: (functionMap & (1 << i)) !== 0
          }));

          let train = this.trains.get(cab);

          if (train) {
            train.speed = speed;
            train.direction = direction;

            functionStates.forEach(funct => {
              train.setFunction(funct.index, funct.state);
            });
          }
        }

        break;
      }

      default:
        break;
    }

  }

  setDirection(cab: number | undefined, dir: Direction) {
    if (!cab) return;

    let train = this.trains.get(cab);

    if (train) {
      fetch(`/api/layout/${this.layoutName}/${this.connUUID}/write?data=<t ${cab} ${train.speed} ${dir}>`)
    }
  }

  getDirection(cab: number | undefined): Direction | undefined {
    if (!cab) return undefined;
    let train = this.trains.get(cab);
    if (!train) return undefined;

    return train.direction;
  }

  setSpeed(cab: number | undefined, speed: number) {
    if (!cab) return;

    let train = this.trains.get(cab);

    if (train) {
      train.speed = speed;
      fetch(`/api/layout/${this.layoutName}/${this.connUUID}/write?data=<t ${cab} ${speed} ${train.direction}>`)
    }
  }

  setFunction(cab: number | undefined, functionId: number, state: boolean) {
    if (!cab) return;

    let train = this.trains.get(cab);

    if (train) {
      fetch(`/api/layout/${this.layoutName}/${this.connUUID}/write?data=<F ${cab} ${functionId} ${+state}>`)
    }
  }

  getTrain(cab: number | undefined) {
    if (cab) {
      return this.trains.get(cab);
    }

    return undefined;
  }

  addTrain(cab: number, name: string) {
    this.trains.set(cab, new Train(cab, name, this.connUUID));
  }
}