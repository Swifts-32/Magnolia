import { SensorClient } from "./SensorClient.svelte";

export class LccSensor extends SensorClient implements SensorClient {
  public activeEvents = 0; // TODO Add a list of LCC events consumed by this sensor
  public inactiveEvents = 0; // TODO Add a list of LCC events consumed by this sensor
}