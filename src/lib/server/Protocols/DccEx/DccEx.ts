import { TrainDirection } from "$lib/client/Trains/Train.svelte";

export class DccEx {
  public static processDccExCommand(command: string) {
    console.log("Processing Dcc Ex Command: ", command)

    if (/<p0>/.test(command)) { // Power Off
      console.log("Power Off");
      return;
    }

    if (/<p1>/.test(command)) { // Power On
      console.log("Power On");
      return;
    }

    const match = command.match(/<l (\d+) (\d+) ([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]) (\d+)>/);
    // if (match) {
    //   const cabId = parseInt(match[1]);
    //   const slot = parseInt(match[2]);
    //   const speedByte = parseInt(match[3]);
    //   const functionMap = parseInt(match[4]);

    //   const { direction, speed, functStates } = DccEx.processCabCommand(cabId, slot, speedByte, functionMap);

    //   const layout = LayoutServerHandler.getLayout(this.uuid);
    //   if (!layout) {
    //     console.log("Layout not found: " + this.uuid);
    //     return;
    //   }

    //   // TODO Add functions states
    //   const trainUuids = await db.update(TrainTable)
    //     .set({
    //       speed: speed,
    //       direction: direction === 0 ? "Reverse" : "Forward"
    //     })
    //     .where(and(eq(TrainTable.address, cabId.toString()), eq(TrainTable.connectionUuid, this.uuid)))
    //     .returning({
    //       uuid: TrainTable.uuid,
    //     });

    //   functStates.forEach((state, i) => {
    //     trainUuids.forEach(async uuid => {
    //       await db.update(TrainFunctionTable)
    //         .set({
    //           state
    //         })
    //         .where(and(eq(TrainFunctionTable.trainUuid, uuid as unknown as TrainUuid), eq(TrainFunctionTable.functValue, i.toString())))
    //     });
    //   });

    //   // const train = layout.getTrain(`${this.uuid}:${cabId}`)
    //   // if (!train) {
    //   //   console.log("Train not found: " + cabId);
    //   //   return;
    //   // }

    //   // train.speed = speed;
    //   // train.direction = direction;
    //   // functStates.forEach((state, i) => {
    //   //   const trainFunct = train.functions.get(i.toString());

    //   //   if (trainFunct) {
    //   //     trainFunct.state = state;
    //   //   }
    //   // });
    // }
  }

  public static processCabCommand(cabId: number, slot: number, speedByte: number, functMap: number): {
    direction: TrainDirection,
    speed: number,
    functStates: boolean[],
  } {

    let direction: number = 0;
    let speed: number = 0;

    if (speedByte < 128) {
      direction = TrainDirection.Reverse; // Reverse
      // 0 = Stop, 0
      // 1 = eStop, 0
      // 2 -> 127 = 1 -> 126
      speed = Math.max(0, speedByte - 1);
    } else {
      direction = TrainDirection.Forward; // Forward
      // 128 = Stop, 0
      // 129 = eStop, 0
      // 130 -> 255 = 1 -> 126
      speed = Math.max(0, speedByte - 128);;
    }

    const functStates = Array.from({ length: 29 }, (_, i) => (
      (functMap & (1 << i)) !== 0
    ));

    return {
      direction,
      speed,
      functStates,
    };
  }
}