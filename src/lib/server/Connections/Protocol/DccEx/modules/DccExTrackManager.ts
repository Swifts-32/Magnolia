export type DccExTrackStates =
  | "PROG"
  | "MAIN"
  | "MAIN_INV"
  | "MAIN_AUTO"
  | "DC"
  | "DCX"
  | "DC_INV"
  | "NONE";

export type DccExTrackPower = "ON" | "OFF" | "UNKNOWN";

export interface TrackStatusEntry {
  trackletter: string; // A -> H
  state: DccExTrackStates;
  power: DccExTrackPower;
  cab?: number;
  current?: number;
  maxCurrent?: number;
}

export class DccExTrackManager {
  public trackStatus: TrackStatusEntry[] = [];

  public processTrackCommand(command: string): void {
    if (!command.startsWith("<=") || !command.endsWith(">")) return;

    const content = command.slice(2, -1).trim();
    const parts = content.split(/\s+/);

    const trackletter = parts[0];
    if (!trackletter || !/^[A-H]$/.test(trackletter)) return;

    let stateArg1 = parts[1];
    let stateArg2 = parts[2];

    let state: DccExTrackStates = "NONE";
    let cab: number | undefined = undefined;

    if (stateArg1 === "MAIN" && stateArg2 === "A") {
      state = "MAIN";
    } else if (stateArg1) {
      state = stateArg1 as DccExTrackStates;
      if (stateArg2) {
        cab = Number(stateArg2);
      }
    }

    if (state === "DC_INV") state = "DCX";

    // If PROG is set, all other tracks must be NONE
    if (state === "PROG") {
      this.trackStatus = this.trackStatus.map((t) =>
        t.trackletter !== trackletter
          ? { ...t, state: "NONE", cab: undefined, power: "OFF" }
          : t,
      );
    }

    const existingIndex = this.trackStatus.findIndex(
      (t) => t.trackletter === trackletter,
    );

    if (existingIndex >= 0) {
      this.trackStatus = this.trackStatus.map((t, idx) =>
        idx === existingIndex ? { ...t, state, cab, power: "OFF" } : t,
      );
    } else {
      this.trackStatus = [
        ...this.trackStatus,
        {
          trackletter,
          state,
          power: "OFF",
          cab,
          current: 0,
          maxCurrent: 0,
        },
      ];
    }
  }

  public updatePower(onOff: string, track?: string) {
    let power: DccExTrackPower =
      onOff === "1" ? "ON" : onOff === "0" ? "OFF" : "UNKNOWN";

    if (!track) {
      this.trackStatus = this.trackStatus.map((t) => ({ ...t, power }));
      return;
    }

    if (/^[A-H]$/.test(track)) {
      this.trackStatus = this.trackStatus.map((t) =>
        t.trackletter === track ? { ...t, power } : t,
      );
    }
  }

  public updateCurrents(values: number[]) {
    this.trackStatus = this.trackStatus.map((t) => {
      const expectedIndex = t.trackletter.charCodeAt(0) - 65;
      if (values[expectedIndex] !== undefined) {
        return { ...t, current: values[expectedIndex] };
      }
      return t;
    });
  }

  public updateMaxCurrents(values: number[]) {
    this.trackStatus = this.trackStatus.map((t) => {
      const expectedIndex = t.trackletter.charCodeAt(0) - 65;
      if (values[expectedIndex] !== undefined) {
        return { ...t, maxCurrent: values[expectedIndex] };
      }
      return t;
    });
  }
}
