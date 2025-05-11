import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import type { SensorState, SensorType, SensorUuid } from "$lib/client/Sensors/SensorClient.svelte";

export interface SensorJsonWeb {
  uuid: SensorUuid;
  connUUID: ConnectionUUID;
  layoutUUID: LayoutUUID;
  name: string;
  delayToActivate: number;
  delayToDeactivate: number;
  state: SensorState;
  comment: string;
  inverted: boolean;
  type: SensorType;
}

export class Sensor {
  public type: SensorType = "basic";

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

  toJsonWeb(): SensorJsonWeb {
    return {
      uuid: this.uuid,
      connUUID: this.connUuid,
      layoutUUID: this.layoutUuid,
      name: this.name,
      delayToActivate: this.delayToActivate,
      delayToDeactivate: this.delayToDeactivate,
      state: this.state,
      comment: this.comment,
      inverted: this.inverted,
      type: this.type,
    };
  }
}