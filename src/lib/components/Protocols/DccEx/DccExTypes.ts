export const DccExTrackStatesList = [
  "PROG",
  "MAIN",
  "MAIN_INV",
  "MAIN_AUTO",
  "DC",
  "DCX",
  "DC_INV",
  "NONE",
] as const;

export type DccExTrackStates = (typeof DccExTrackStatesList)[number];

export type DccExTrackPower = "ON" | "OFF" | "UNKNOWN";

export interface TrackStatusEntry {
  trackletter: string; // A -> H
  state: DccExTrackStates;
  power: DccExTrackPower;
  cab?: number;
  current?: number;
  maxCurrent?: number;
}
