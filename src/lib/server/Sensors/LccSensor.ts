// import type { SensorState, SensorType } from "$lib/client/Sensors/SensorClient.svelte";
// import { Sensor, type SensorJsonWeb } from "./Sensor";

// export interface LccSensorJsonWeb extends SensorJsonWeb {
//   activeEvents: number;
//   inactiveEvents: number;
//   type: SensorType;
// }

// export class LccSensor extends Sensor implements Sensor {
//   public type: SensorType = "lcc";
//   public activeEvents = 0; // TODO Add a list of LCC events consumed by this sensor
//   public inactiveEvents = 0; // TODO Add a list of LCC events consumed by this sensor


//   override toJsonWeb(): LccSensorJsonWeb {
//     return {
//       ...super.toJsonWeb(),
//       activeEvents: this.activeEvents,
//       inactiveEvents: this.inactiveEvents,
//       type: this.type,
//     };
//   }
// }