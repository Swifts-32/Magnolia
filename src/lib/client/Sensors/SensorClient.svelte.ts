import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
 

export type SensorUuid = `${string}-${string}-${string}-${string}-${string}`;
export type SensorState = "active" | "inactive" | "unknown";
export type SensorType = "basic" | "lcc";

export class SensorClient {
  public uuid: SensorUuid;
  public connUuid: ConnectionUUID;
  public layoutUuid: LayoutUUID;

  public name: string = "";
  public delayToActivate: number = 0;
  public delayToDeactivate: number = 0;
  public state: SensorState = "unknown";
  public comment: string = "";
  public inverted: boolean = false;

  constructor(connUuid: ConnectionUUID, layoutUuid: LayoutUUID, uuid?: SensorUuid) {
    this.connUuid = connUuid;
    this.layoutUuid = layoutUuid;
    this.uuid = uuid ?? crypto.randomUUID() as SensorUuid;
  }
}