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
