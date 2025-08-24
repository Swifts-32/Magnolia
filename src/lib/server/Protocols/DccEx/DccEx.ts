import { TrainDirection } from "$lib/client/Trains/Train.svelte";

export class DccEx {
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