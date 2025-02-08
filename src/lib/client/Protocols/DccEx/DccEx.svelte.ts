import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { TrainDirection, type ClientTrain } from "$lib/client/Trains/Train.svelte";
import type { TrainUUID } from "$lib/server/Trains/Train.server";
import { Direction } from "../../../../routes/(app)/layouts/[id]/throttle/throttle";
import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";
import { Train } from "../../../../services/train.svelte";
import { ConnectionProtocols, ConnectionTypes, type IProtocol } from "../protocols";

export class DccEx implements IProtocol {
  public powerStatus: boolean = $state(false);
  public version: string | undefined = undefined;

  public readonly protocol: ConnectionProtocols = ConnectionProtocols.DCCEX;
  public connType: ConnectionTypes;
  public connUUID: ConnectionUUID;
  public layoutUUID: LayoutUUID;
  public connName: string;
  public isConnected: boolean = $state(false);

  constructor(layoutUUID: LayoutUUID, connUUID: ConnectionUUID, connName: string, connType: ConnectionTypes) {
    this.layoutUUID = layoutUUID;
    this.connUUID = connUUID;
    this.connName = connName;
    this.connType = connType;
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

          let train = layoutClientHandler.layouts.get(this.layoutUUID)?.getTrain(cab, this.connUUID);

          if (train) {
            train.speed = speed;
            train.direction = direction;

            // TODO: Implement function states
            // functionStates.forEach(funct => {
            //   train.setFunction(funct.index, funct.state);
            // });
          }
        }

        break;
      }

      default:
        break;
    }

  }

  setDirection(train: ClientTrain) {
    fetch(`/api/layout/${this.layoutUUID}/${this.connUUID}/write?data=<t ${train.address} ${train.speed} ${train.direction}>`);
  }

  setSpeed(train: ClientTrain) {
    fetch(`/api/layout/${this.layoutUUID}/${this.connUUID}/write?data=<t ${train.address} ${train.speed} ${train.direction}>`);
  }
}