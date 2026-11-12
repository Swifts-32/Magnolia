export type SunbeamBlockStatus = "active" | "inactive" | "unknown";

export interface SunbeamBlock {
  uuid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: SunbeamBlockStatus;
}
