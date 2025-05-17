import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";


export type SensorUuid = `${string}-${string}-${string}-${string}-${string}`;
export type SensorState = "active" | "inactive" | "unknown";
export type SensorType = "basic" | "lcc";

export class SensorClient {
  public uuid: SensorUuid;
  public layoutUuid: LayoutUUID;

  public connUuid: ConnectionUUID | undefined;
  public name: string = $state("");
  public delayToActivate: number = $state(0);
  public delayToDeactivate: number = $state(0);
  public state: SensorState = $state("unknown");
  public comment: string = $state("");
  public inverted: boolean = $state(false);

  constructor(layoutUuid: LayoutUUID, uuid?: SensorUuid) {
    this.layoutUuid = layoutUuid;
    this.uuid = uuid ?? crypto.randomUUID() as SensorUuid;
  }

  public toJsonWeb(): string {
    return JSON.stringify({
      layoutUUID: this.layoutUuid,
      uuid: this.uuid,

      connUUID: this.connUuid,
      name: this.name,
      delayToActivate: this.delayToActivate,
      delayToDeactivate: this.delayToDeactivate,
      state: this.state,
      comment: this.comment,
      inverted: this.inverted,
    });
  }
}